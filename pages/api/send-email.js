export default async (req, res) => {
  // ✅ CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*'); // 또는 'https://www.defineip.kr' 정확히 명시
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ 사전 요청 처리 (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // 브라우저 사전 요청에 대한 응답
  }

  if (req.method === 'POST') {
    const { name, email, category, company, phone, qna } = req.body;

    const emailParams = {
      Source: 'ip@defineip.kr',
      Destination: {
        ToAddresses: ['ip@defineip.kr'],
      },
      Message: {
        Subject: { Data: '[DEFINE] 웹사이트 문의 도착' },
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
      ReplyToAddresses: [email],
    };

    try {
      const data = await ses.sendEmail(emailParams).promise();
      console.log("Email sent successfully", data);
      res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
      console.error("Error sending email", error);
      res.status(500).json({ message: '이메일 전송 실패' });
    }
  } else {
    res.status(405).json({ message: '허용되지 않은 요청' });
  }
};