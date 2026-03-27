const returnHTML = function (processMsg, firstName, email, subject, otp) {
  if ([processMsg, email, subject, otp].some((field) => !field)) {
    return "";
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <title>Prose OTP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f2f7ee; font-family: 'Noto Sans', 'PingFang SC', 'Alibaba PuHuiTi', sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f7ee; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(85, 170, 0, 0.12);" border="0" cellspacing="0" cellpadding="0">

          <!-- Top accent bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #55aa00 0%, #7dcf2a 100%); height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 12px 40px;">
              <img src="https://ik.imagekit.io/mksiz1z5tvi7/PROSE/logo.png" alt="Prose Logo" width="110" style="display: block; border: 0;">
            </td>
          </tr>

          <!-- Tagline -->
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <p style="font-family: 'Noto Sans', 'PingFang SC', 'Alibaba PuHuiTi', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #55aa00; margin: 0;">One-Time Password</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #d4edba, transparent);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px 12px 40px; text-align: center; color: #1f2937;">

              <h2 style="font-family: 'Noto Sans', 'PingFang SC', 'Alibaba PuHuiTi', sans-serif; font-size: 22px; font-weight: 400; margin: 0 0 12px 0; color: #0f172a;">
                Hi ${firstName}
              </h2>

              <p style="font-size: 15px; line-height: 26px; color: #4b5563; margin: 0 0 32px 0; font-weight: 400;">
                To continue with <span>${processMsg}</span> on PROSE,<br>
                Use the One-Time Password given below.
              </p>

              <!-- OTP Box -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 32px auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f2f9ec 0%, #eaf5e0 100%); padding: 24px 48px; text-align: center;">
                    <span style="font-family: 'Noto Sans', 'PingFang SC', 'Alibaba PuHuiTi', sans-serif; font-size: 42px; font-weight: 400; letter-spacing: 14px; color: #55aa00; display: block;">${otp}</span>
                  </td>
                </tr>
              </table>

              <!-- Validity note -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 8px auto;">
                <tr>
                  <td style="background-color: #fef9ec; padding: 10px 20px; text-align: center;">
                    <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 400;">
                      ⏱&nbsp; The OTP is valid only for 2 minutes.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0 0; font-weight: 400;">
                🔒 &nbsp;Do not share this code with anyone.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 28px 40px 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #d4edba, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; text-align: center;">
              <p style="font-size: 14px; color: #94a3b8; margin: 0 0 4px 0; font-weight: 400;">Thank you,</p>
              <p style="font-family: 'Noto Sans', 'PingFang SC', 'Alibaba PuHuiTi', sans-serif; font-size: 18px; font-weight: 700; color: #55aa00; margin: 0;">The Prose Team</p>
            </td>
          </tr>

        </table>

        <!-- Footer note -->
        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center; letter-spacing: 0.5px; font-weight: 400;">
          &copy; 2026 PROSE. All rights reserved.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default returnHTML;
