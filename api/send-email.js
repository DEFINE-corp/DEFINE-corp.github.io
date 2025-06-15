// /api/send-email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // 환경 변수에 설정 필요

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { name, email, category, company, phone, qna } = req.body;

  const content = `
  [문의 분야]: ${category}
  [이름]: ${name}
  [회사]: ${company}
  [전화번호]: ${phone}
  [이메일]: ${email}
  [문의 내용]: ${qna}
  `;

  try {
    await sgMail.send({
      to: 'meeyun90@gmail.com', // 수신자
      from: 'your_verified_sender@example.com', // SendGrid에 등록된 발신자
      subject: '[DEFINE] 웹사이트 문의 도착',
      text: content,
    });

    return res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
  } catch (error) {
    console.error(error.response?.body || error);
    return res.status(500).json({ message: '이메일 전송 실패' });
  }
}