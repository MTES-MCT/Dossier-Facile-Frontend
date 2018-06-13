package fr.gouv.locatio.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeUtility;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendMail(final String from, final String to, final String bcc, final String replyToEmail, final String subject, final String msg) {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            if (bcc != null) {
                mimeMessage.setRecipient(Message.RecipientType.BCC, new InternetAddress(bcc));
            }
            mimeMessage.setFrom(new InternetAddress(from));
            mimeMessage.setReplyTo(new javax.mail.Address[]
                    {
                            new InternetAddress(replyToEmail)
                    });
            mimeMessage.setSubject(MimeUtility.encodeText(subject, "UTF-8", "Q"));
            mimeMessage.setContent(msg, "text/html; charset=utf-8");
        };
        try {
            mailSender.send(messagePreparator);

        } catch (MailException e) {
            System.err.println("Exception: " + e);
            return false;
        }
        return true;
    }

    @Async
    public void sendAsyncMail(String from, String to, String replyToEmail, String subject, String msg) {
        sendMail(from, to, null, replyToEmail, subject, msg);
    }

    @Async
    public void sendAsyncMail(String from, String to, String bcc, String replyToEmail, String subject, String msg) {
        sendMail(from, to, bcc, replyToEmail, subject, msg);
    }
}
