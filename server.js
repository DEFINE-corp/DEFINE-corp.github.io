// pages/api/send-email.js
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,  // Vercel 환경 변수에서 리전 읽기
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Vercel 환경 변수에서 키 읽기
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Vercel 환경 변수에서 비밀 키 읽기
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, category, company, phone, qna } = req.body;

    // 이메일 내용 구성
    const emailParams = {
      Source: 'ip@defineip.kr', // 검증된 발신자 이메일 주소
      Destination: {
        ToAddresses: ['ip@defineip.kr'], // 수신자 이메일 주소
      },
      Message: {
        Subject: {
          Data: '[DEFINE] 웹사이트 문의 도착',
        },
        Body: {
          Text: {
            Data: `
              [문의 분야]: ${category}
              [이름]: ${name}
              [회사]: ${company}
              [전화번호]: ${phone}
              [이메일]: ${email}
              [문의 내용]: ${qna}
            `,
          },
        },
      },
    };

    // SES를 통해 이메일 전송
    try {
      const data = await ses.sendEmail(emailParams).promise();
      console.log("Email sent successfully", data);
      res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
      console.error("Error sending email", error);
      res.status(500).json({ message: '이메일 전송 실패' });
    }
  } else {
    // POST가 아닌 경우 오류 반환
    res.status(405).json({ message: '허용되지 않은 요청' });
  }
};