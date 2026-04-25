require('dotenv').config();

const settings = {
  packname: process.env.PACK_NAME || 'ITACHI-XMD',
  author: process.env.PACK_AUTHOR || 'IBSACKO',
  botName: process.env.BOT_NAME || 'ITACHI-XMD',
  botOwner: process.env.OWNER_NAME || 'Ibrahima sory sacko',
  ownerNumber: process.env.OWNER_NUMBER || '224621963059',
  prefix: process.env.PREFIX || '.',
  giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: process.env.COMMAND_MODE || 'public',
  maxStoreMessages: 20,
  storeWriteInterval: 10000,
  description: "Bot WhatsApp multifonctions - ITACHI-XMD",
  version: process.env.BOT_VERSION || '2.0.0',
  ytch: process.env.YT_CHANNEL || '',
  waChannel: process.env.WA_CHANNEL || '',
  updateZipUrl: "https://github.com/centralbot224/ITACHI-XMD",
};

module.exports = settings;
