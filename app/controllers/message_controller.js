const whatsapp = require("wa-multi-session");
const ValidationError = require("../../utils/error");
const { responseSuccessWithData } = require("../../utils/response");
const fs = require("fs");

exports.sendMessage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let isGroup = req.body.isGroup || req.query.isGroup;
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    if (!to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");
    const send = await whatsapp.sendTextMessage({
      sessionId,
      to: receiver,
      isGroup: !!isGroup,
      text,
    });

    res.status(200).json(
      responseSuccessWithData({
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.sendBulkMessage = async (req, res, next) => {
  try {
    const sessionId =
      req.body.session || req.query.session || req.headers.session;
    const delay = req.body.delay || req.query.delay || req.headers.delay;
    if (!sessionId) {
      return res.status(400).json({
        status: false,
        data: {
          error: "Session Not Found",
        },
      });
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message is Processing",
      },
    });
    for (const dt of req.body.data) {
      const to = dt.to;
      const text = dt.text;
      const isGroup = !!dt.isGroup;

      await whatsapp.sendTextMessage({
        sessionId,
        to: to,
        isGroup: isGroup,
        text: text,
      });
      await whatsapp.createDelay(delay ?? 1000);
    }
    console.log("SEND BULK MESSAGE WITH DELAY SUCCESS");
  } catch (error) {
    next(error);
  }
};

exports.sendPdf = async (req, res, next) => {
try {
let to = req.body.to || req.query.to;
let media = req.body.media || req.query.media;
let isGroup = req.body.isGroup || req.query.isGroup;
const sessionId =
req.body.session || req.query.session || req.headers.session;

if (!to || !media) throw new ValidationError("Missing Parameters");

const receiver = to;
const filename = media;
const document = fs.readFileSync(media); // return Buffer

if (!sessionId) throw new ValidationError("Session Not Founds");
const send = await whatsapp.sendDocument({
  sessionId,
  to: receiver,
  isGroup: !!isGroup,
  filename: filename,
  media: document,
});

res.status(200).json(
  responseSuccessWithData({
    id: send?.key?.id,
    status: send?.status,
    message: send?.message?.extendedTextMessage?.caption || "Not Text",
    remoteJid: send?.key?.remoteJid,
  })
);
} catch (error) {
next(error);
}
};

exports.sendImg = async (req, res, next) => {
try {
let to = req.body.to || req.query.to;
let media = req.body.media || req.query.media;
let isGroup = req.body.isGroup || req.query.isGroup;
const sessionId =
req.body.session || req.query.session || req.headers.session;

if (!to || !media) throw new ValidationError("Missing Parameters");

const receiver = to;
const filename = media;
const image = fs.readFileSync(media); // return Buffer

if (!sessionId) throw new ValidationError("Session Not Founds");
const send = await whatsapp.sendImage({
  sessionId,
  to: receiver,
  isGroup: !!isGroup,
  filename: filename,
  media: image,
});

res.status(200).json(
  responseSuccessWithData({
    id: send?.key?.id,
    status: send?.status,
    message: send?.message?.extendedTextMessage?.caption || "Not Text",
    remoteJid: send?.key?.remoteJid,
  })
);
} catch (error) {
next(error);
}
};

