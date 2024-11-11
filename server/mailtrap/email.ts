import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const res = await client.send({
        from: sender,
        to: recipient,
        subject: 'Verify your email',
        html: htmlContent.replace("{verificationToken}", verificationToken), 
        category: "Email Verification"
    })
  } catch (error) {
    console.log(error)
    throw new Error("Failed to send email verification")
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [
        {
          email,
        },
      ];
      const htmlContent = generateWelcomeEmailHtml(name)
      try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Welcome to FastBites',
            html: htmlContent,
            template_variables: {
                company_info_name: "FastBites",
                name: name
            }
        })
      } catch (error) {
        console.log(error)
        throw new Error("Failed to send Welcome email")
      }
}

export const sendPasswordResetEmail = async (email: string, resetURL:string)=>{
    const recipient = [
        {
          email,
        },
      ];
      const htmlContent = generatePasswordResetEmailHtml(resetURL)
      try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html: htmlContent,
            category: "Reset Password"
        })
      } catch (error) {
        console.log(error)
        throw new Error("Failed to send Reset Password email")
      }
}

export const sendResetSuccessEmail = async (email: string)=>{
    const recipient = [
        {
          email,
        },
      ];
      const htmlContent = generateResetSuccessEmailHtml()
      try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Succesfully',
            html: htmlContent,
            category: "Password Reset"
        })
      } catch (error) {
        console.log(error)
        throw new Error("Failed to send Password Reset Success email")
      }
}

