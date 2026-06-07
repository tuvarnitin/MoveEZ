import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },

})

transporter.verify()
  .then(() => console.log("SMTP connection successful"))
  .catch(err => {
    console.error("FULL ERROR:", err);
    console.error("CODE:", err.code);
    console.error("MESSAGE:", err.message);
  });

export const sendOtp = async (name, email, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: `Your code - ${otp}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>MoveEZ OTP Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f172a;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <!-- Main Card -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            background:#111827;
            border:1px solid #1f2937;
            border-radius:20px;
            overflow:hidden;
          "
        >

          <!-- Top Accent -->
          <tr>
            <td
              style="
                height:6px;
                background:linear-gradient(
                  90deg,
                  #f97316,
                  #fb923c,
                  #f97316
                );
              "
            ></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:35px 40px 15px;">
              <img
                src="https://res.cloudinary.com/dhm3xypip/image/upload/v1780738057/logo_kwvwtc.png"
                alt="MoveEZ"
                width="240"
                style="display:block;max-width:240px;"
              />
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding:0 40px;">
              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:32px;
                  font-weight:700;
                "
              >
                Verify Your Account
              </h1>

              <p
                style="
                  margin-top:12px;
                  color:#94a3b8;
                  font-size:15px;
                  line-height:24px;
                "
              >
                Complete your registration using the verification code below.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:10px 40px 0;">

              <p
                style="
                  color:#e5e7eb;
                  font-size:16px;
                  line-height:28px;
                  margin:0;
                "
              >
                Hi <strong>${name}</strong>,
              </p>

              <p
                style="
                  color:#94a3b8;
                  font-size:15px;
                  line-height:28px;
                  margin-top:15px;
                "
              >
                Your MoveEZ account has been created successfully.
                Use the OTP below to verify your email address.
              </p>

            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:30px 40px;">

              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#0f172a;
                  border:1px solid #334155;
                  border-radius:16px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:20px 40px;
                      color:#f97316;
                      font-size:40px;
                      font-weight:700;
                      letter-spacing:10px;
                    "
                  >
                    ${otp}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td align="center" style="padding:0 40px;">

              <p
                style="
                  margin:0;
                  color:#cbd5e1;
                  font-size:15px;
                "
              >
                This OTP is valid for
                <span
                  style="
                    color:#f97316;
                    font-weight:bold;
                  "
                >
                  5 minutes
                </span>.
              </p>

            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td style="padding:30px 40px;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#0f172a;
                  border:1px solid #1e293b;
                  border-radius:12px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:18px;
                      color:#94a3b8;
                      font-size:14px;
                      line-height:24px;
                    "
                  >
                    If you didn't request this verification code,
                    you can safely ignore this email.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                border-top:1px solid #1f2937;
                padding:25px 40px;
              "
            >

              <p
                style="
                  margin:0;
                  color:#64748b;
                  font-size:13px;
                "
              >
                © 2026 MoveEZ. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
  },
    function (error, info) {
      if (error) {
        if (error.message === "No recipients defined") {
          throw new Error("Email not exists")
        }
        return error
      } else {
        return info
      }
    })
}