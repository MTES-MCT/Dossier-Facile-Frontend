package fr.gouv.locatio.service.FileProcess;

import fr.gouv.locatio.entity.Tenant;
import org.apache.commons.io.FilenameUtils;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPageTree;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.PDFTextStripperByArea;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.lept;
import org.bytedeco.javacpp.tesseract;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import static org.bytedeco.javacpp.lept.pixDestroy;
import static org.bytedeco.javacpp.lept.pixRead;

public class FileUtils  extends FilenameUtils{

    public static String imageOCR(String file) {
        BytePointer outText;
        tesseract.TessBaseAPI api = new tesseract.TessBaseAPI();
        if (api.Init(null, "fra") != 0) {
            System.err.println("Could not initialize tesseract.");
            System.exit(1);
        }
        lept.PIX image = pixRead(file);
        api.SetImage(image);

        outText = api.GetUTF8Text();

        api.End();
        outText.deallocate();
        pixDestroy(image);
        return outText.getString();
    }

    public static String[] convertPDFToImage(String pathFile) {
        String[] fileName = null;
        try (final PDDocument document = PDDocument.load(new File(pathFile))) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            fileName = new String[document.getNumberOfPages()];
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
                fileName[page] = getFullPath(pathFile) + "image-" + System.nanoTime() + ".png";
                ImageIOUtil.writeImage(bim, fileName[page], 300);
            }
            document.close();
        } catch (IOException e) {
            System.err.println("Exception while trying to create pdf document - " + e);
        }
        return fileName;
    }

    private static String extractImagePDF(String pathFile) {
        try (final PDDocument document = PDDocument.load(new File(pathFile))) {
            PDPageTree list = document.getPages();
            PDResources pdResources = list.get(0).getResources();
            int i = 1;
            for (COSName name : pdResources.getXObjectNames()) {
                PDXObject o = pdResources.getXObject(name);
                if (o instanceof PDImageXObject) {
                    PDImageXObject image = (PDImageXObject) o;
                    String filename = getFullPath(pathFile) + "extracted-image-" + System.nanoTime() + ".png";
                    ImageIO.write(image.getImage(), "png", new File(filename));
                    i++;
                }
            }


        } catch (IOException e) {
            System.err.println("Exception while trying to create pdf document - " + e);
        }
        return "";
    }

    public static String extractTextPDF(String pathFile) throws IOException {
        String pdfFileInText = null;
        try (PDDocument document = PDDocument.load(new File(pathFile))) {

            document.getClass();

            if (!document.isEncrypted()) {
                PDFTextStripperByArea stripper = new PDFTextStripperByArea();
                stripper.setSortByPosition(true);
                PDFTextStripper tStripper = new PDFTextStripper();
                pdfFileInText = tStripper.getText(document);

            }

        }
        return pdfFileInText;
    }

    public static boolean containsName(String result, Tenant tenant) {
        return result.contains(tenant.getFirstName()) && result.contains(tenant.getLastName());
    }
}
