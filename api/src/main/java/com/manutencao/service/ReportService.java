package com.manutencao.service;

import com.manutencao.entity.RequestStatus;
import com.manutencao.entity.Solicitation;
import com.manutencao.repository.SolicitationRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class ReportService {

    private static final String UNCATEGORIZED = "Não Categorizado";
    private static final DateTimeFormatter BR_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Locale PT_BR = new Locale("pt", "BR");

    private final SolicitationRepository solicitationRepository;

    public ReportService(SolicitationRepository solicitationRepository) {
        this.solicitationRepository = solicitationRepository;
    }

    public List<DailyRevenueRow> getRevenueByPeriod(LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);

        Map<LocalDate, BigDecimal> grouped = new TreeMap<>();
        for (Solicitation solicitation : solicitationRepository.findAll()) {
            if (!isPaidOrFinalized(solicitation)) {
                continue;
            }

            LocalDate referenceDate = extractReferenceDate(solicitation);
            if (referenceDate == null) {
                continue;
            }

            if (startDate != null && referenceDate.isBefore(startDate)) {
                continue;
            }
            if (endDate != null && referenceDate.isAfter(endDate)) {
                continue;
            }

            BigDecimal quoteValue = toMoney(solicitation.getQuoteValue());
            grouped.merge(referenceDate, quoteValue, BigDecimal::add);
        }

        List<DailyRevenueRow> result = new ArrayList<>();
        for (Map.Entry<LocalDate, BigDecimal> entry : grouped.entrySet()) {
            result.add(new DailyRevenueRow(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    public List<CategoryRevenueRow> getRevenueByCategory() {
        Map<String, BigDecimal> grouped = new HashMap<>();

        for (Solicitation solicitation : solicitationRepository.findAll()) {
            if (!isPaidOrFinalized(solicitation)) {
                continue;
            }

            String category = normalizeCategoryName(solicitation.getCategoryName());
            BigDecimal quoteValue = toMoney(solicitation.getQuoteValue());
            grouped.merge(category, quoteValue, BigDecimal::add);
        }

        List<CategoryRevenueRow> result = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : grouped.entrySet()) {
            result.add(new CategoryRevenueRow(entry.getKey(), entry.getValue()));
        }

        result.sort(Comparator.comparing(CategoryRevenueRow::total).reversed()
                .thenComparing(CategoryRevenueRow::category));
        return result;
    }

    public byte[] generateRevenueByPeriodPdf(LocalDate startDate, LocalDate endDate) {
        List<DailyRevenueRow> rows = getRevenueByPeriod(startDate, endDate);
        BigDecimal total = rows.stream()
                .map(DailyRevenueRow::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String periodLabel = buildPeriodLabel(startDate, endDate);
        return buildPdf(
                "Relatório de Receitas por Período",
                periodLabel,
                List.of("Data", "Receita Total"),
                rows.stream()
                        .map(r -> List.of(formatDate(r.date()), formatCurrency(r.total())))
                        .toList(),
                total
        );
    }

    public byte[] generateRevenueByCategoryPdf() {
        List<CategoryRevenueRow> rows = getRevenueByCategory();
        BigDecimal total = rows.stream()
                .map(CategoryRevenueRow::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return buildPdf(
                "Relatório de Receitas por Categoria",
                "Acumulado histórico de todas as solicitações pagas/finalizadas",
                List.of("Categoria", "Receita Total"),
                rows.stream()
                        .map(r -> List.of(r.category(), formatCurrency(r.total())))
                        .toList(),
                total
        );
    }

    private byte[] buildPdf(
            String title,
            String subtitle,
            List<String> headers,
            List<List<String>> rows,
            BigDecimal grandTotal
    ) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, output);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font subtitleFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 10, Font.NORMAL);

            document.add(new Paragraph(title, titleFont));
            document.add(new Paragraph(subtitle, subtitleFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(headers.size());
            table.setWidthPercentage(100f);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new Color(235, 235, 235));
                cell.setPadding(6f);
                table.addCell(cell);
            }

            if (rows.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("Nenhum registro encontrado", bodyFont));
                emptyCell.setColspan(headers.size());
                emptyCell.setPadding(8f);
                table.addCell(emptyCell);
            } else {
                for (List<String> row : rows) {
                    for (String value : row) {
                        PdfPCell cell = new PdfPCell(new Phrase(value, bodyFont));
                        cell.setPadding(6f);
                        table.addCell(cell);
                    }
                }

                PdfPCell totalLabelCell = new PdfPCell(new Phrase("Total Geral", headerFont));
                totalLabelCell.setColspan(Math.max(1, headers.size() - 1));
                totalLabelCell.setPadding(6f);
                totalLabelCell.setBackgroundColor(new Color(245, 245, 245));
                table.addCell(totalLabelCell);

                PdfPCell totalValueCell = new PdfPCell(new Phrase(formatCurrency(grandTotal), headerFont));
                totalValueCell.setPadding(6f);
                totalValueCell.setBackgroundColor(new Color(245, 245, 245));
                table.addCell(totalValueCell);
            }

            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (DocumentException ex) {
            throw new IllegalStateException("Erro ao gerar PDF de relatório.", ex);
        } catch (Exception ex) {
            throw new IllegalStateException("Erro inesperado ao gerar relatório.", ex);
        }
    }

    private boolean isPaidOrFinalized(Solicitation solicitation) {
        return solicitation.getStatus() == RequestStatus.PAID
                || solicitation.getStatus() == RequestStatus.FINALIZED;
    }

    private LocalDate extractReferenceDate(Solicitation solicitation) {
        String raw = firstNonBlank(solicitation.getPaidAt(), solicitation.getFinalizedAt());
        if (raw == null) {
            return null;
        }

        String trimmed = raw.trim();
        String datePart = trimmed.length() >= 10 ? trimmed.substring(0, 10) : trimmed;

        try {
            return LocalDate.parse(datePart);
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.trim().isEmpty()) {
            return first;
        }
        if (second != null && !second.trim().isEmpty()) {
            return second;
        }
        return null;
    }

    private String normalizeCategoryName(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            return UNCATEGORIZED;
        }
        return categoryName.trim();
    }

    private BigDecimal toMoney(Double value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(value);
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Data inicial não pode ser maior que a data final.");
        }
    }

    private String buildPeriodLabel(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return "Período: todos os registros";
        }
        String start = startDate == null ? "início" : formatDate(startDate);
        String end = endDate == null ? "hoje" : formatDate(endDate);
        return "Período: " + start + " até " + end;
    }

    private String formatDate(LocalDate date) {
        return date.format(BR_DATE_FORMAT);
    }

    private String formatCurrency(BigDecimal value) {
        return NumberFormat.getCurrencyInstance(PT_BR).format(value);
    }

    public record DailyRevenueRow(LocalDate date, BigDecimal total) {
    }

    public record CategoryRevenueRow(String category, BigDecimal total) {
    }
}
