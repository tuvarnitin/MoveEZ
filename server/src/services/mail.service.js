import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },

})

try {
  await transporter.verify();
  console.log("SMTP connection successful");
} catch (err) {
  console.error("SMTP connection failed:", err);
}

export const sendOtp = async (name, email, otp) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: `Your code - ${otp}`,
    html: `<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
  <title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;">
          <tr>
            <td style="padding:40px;text-align:center;">
              <h2 style="margin:0;color:#333333;">
                Verify Your Account
              </h2>
            < p style="margin:20px 0;color:#666666;font-size:16px;line-height:1.6;" >
            Dear ${name},
          </p >
            < p style="margin:20px 0;color:#666666;font-size:16px;line-height:1.6;" >
            Your account is created successfully.
          </p >
            < p style="margin:20px 0;color:#666666;font-size:16px;line-height:1.6;" >
            Use the following One- Time Password(OTP) to complete your verification.
          </p >

          <div style="margin:30px 0;">
            <span style="display:inline-block;padding:15px 30px;font-size:32px;font-weight:bold;letter-spacing:8px;background:#f3f4f6;border-radius:8px;color:#111827;">
              ${ otp }
            </span>
          </div>

          <p style="color:#666666;font-size:14px;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p style="margin-top:25px;color:#999999;font-size:14px;">
            If you did not request this OTP, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

          <p style="color:#9ca3af;font-size:12px;">
            © MoveEZ. All rights reserved.
          </p>
        </td>
      </tr >
    </table >
  </td >
</tr >
  </table>
</body>
</html>
`
  },
    function (error, info) {
      if (error) {
        if(error.message === "No recipients defined"){
          throw new Error("Email not exists")
        }else{
          console.log(error)
        }
        return error
      } else {
        console.log(`Mail sent ${info.response}`)
        return info
      }
    })
}