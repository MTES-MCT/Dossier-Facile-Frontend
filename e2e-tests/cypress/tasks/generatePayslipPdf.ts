import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

interface PayslipParams {
  name: string;
  firstName: string;
  date: string;
  amount: string;
  outputPath: string;
}

export async function generatePayslipPdf({
  name,
  firstName,
  date,
  amount,
  outputPath,
}: PayslipParams): Promise<string> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595, 842]);

  page.drawText("BULLETIN DE PAIE", {
    x: 50,
    y: 780,
    size: 20,
    font: boldFont,
  });
  page.drawText("Entreprise SAS Example", { x: 50, y: 750, size: 12, font });
  page.drawText("SIRET : 123 456 789 00012", { x: 50, y: 735, size: 10, font });

  page.drawText(`Salarie : ${name} ${firstName}`, {
    x: 50,
    y: 690,
    size: 14,
    font,
  });
  page.drawText("Emploi : Rémouleur", { x: 50, y: 670, size: 12, font });
  page.drawText(`Periode : ${date}`, { x: 50, y: 650, size: 12, font });

  page.drawText("Salaire brut :", { x: 50, y: 600, size: 12, font });
  page.drawText(`${amount} EUR`, { x: 400, y: 600, size: 12, font });
  page.drawText("Cotisations salariales :", { x: 50, y: 580, size: 12, font });
  page.drawText("- 450,00 EUR", { x: 400, y: 580, size: 12, font });
  page.drawText("Net a payer :", { x: 50, y: 540, size: 14, font: boldFont });
  page.drawText("1 500,00 EUR", { x: 400, y: 540, size: 14, font: boldFont });

  const bytes = await doc.save();
  const fullPath = path.resolve(__dirname, "..", "..", outputPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, bytes);
  return fullPath;
}
