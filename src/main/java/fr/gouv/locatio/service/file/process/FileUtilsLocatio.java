package fr.gouv.locatio.service.file.process;

import fr.gouv.locatio.entity.Tenant;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import static org.bytedeco.javacpp.lept.pixDestroy;
import static org.bytedeco.javacpp.lept.pixRead;

public class FileUtilsLocatio extends FilenameUtils {

    private static final Logger logger = LoggerFactory.getLogger(FileUtilsLocatio.class);

    public static String imageOCR(String file) {
        BytePointer outText;
        tesseract.TessBaseAPI api = new tesseract.TessBaseAPI();
        if (api.Init(null, "fra") != 0) {
            logger.error("Could not initialize tesseract.");
            return "";
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
            logger.error("Exception while trying to create pdf document - " + e);
        }
        return fileName;
    }

    private static String extractImagePDF(String pathFile) {
        String filename = "";
        try (final PDDocument document = PDDocument.load(new File(pathFile))) {
            PDPageTree list = document.getPages();
            PDResources pdResources = list.get(0).getResources();
            for (COSName name : pdResources.getXObjectNames()) {
                PDXObject o = pdResources.getXObject(name);
                if (o instanceof PDImageXObject) {
                    PDImageXObject image = (PDImageXObject) o;
                    filename = getFullPath(pathFile) + "extracted-image-" + System.nanoTime() + ".png";
                    ImageIO.write(image.getImage(), "png", new File(filename));
                }
            }
        } catch (IOException e) {
            logger.error("Exception while trying to extract image from pdf - " + e);
        }
        return filename;
    }

    public static String extractTextPDF(String pathFile) {
        String pdfFileInText = null;
        try (PDDocument document = PDDocument.load(new File(pathFile))) {

            document.getClass();

            if (!document.isEncrypted()) {
                PDFTextStripperByArea stripper = new PDFTextStripperByArea();
                stripper.setSortByPosition(true);
                PDFTextStripper tStripper = new PDFTextStripper();
                pdfFileInText = tStripper.getText(document);

            }

        } catch (IOException e) {
            logger.error("Exception white trying extract text to pdf - " + e);
        }
        return pdfFileInText;
    }

    public static boolean containsName(String s, Tenant tenant) {
        return StringUtils.containsIgnoreCase(s, tenant.getFirstName()) && StringUtils.containsIgnoreCase(s, tenant.getLastName());
    }

    public static byte[] convertImgToPDF(MultipartFile multipartFile) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PDDocument document = new PDDocument();
            BufferedImage bimg = ImageIO.read(multipartFile.getInputStream());
            float width = bimg.getWidth();
            float height = bimg.getHeight();
            PDPage page = new PDPage(new PDRectangle(width, height));
            document.addPage(page);
            PDImageXObject img = PDImageXObject.createFromByteArray(document, multipartFile.getBytes(), multipartFile.getOriginalFilename());
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.drawImage(img, 0, 0);
            contentStream.close();
            document.save(baos);
            document.close();
        } catch (IOException e){
            logger.error("Exception white trying convert image to pdf - " + e);
        }
        return baos.toByteArray();
    }


    public static HashMap<String, Integer> extractNumbersText(String s) {
        s = s.replaceAll(" ", "");
        HashMap<String, Integer> numbers = new HashMap();
        char[] chars = s.toCharArray();
        String number = "";
        for (char c : chars) {
            if (Character.isDigit(c)) {
                number += c;
                continue;
            } else if (!number.equals("")) {
                if (numbers.get(number) != null) {
                    numbers.put(number, numbers.get(number) + 1);
                } else {
                    numbers.put(number, 1);
                }
                number = "";
            }
        }

        return numbers;
    }
}
