/**
* Base By NdyZz [ github.com/NdyZz ]
* Created On 1/7/2024
* Contact Me on wa.me/6285346923840
*/

require('./config')
const {
	default: makeWASocket,
		useMultiFileAuthState,
		DisconnectReason,
		fetchLatestBaileysVersion,
		makeInMemoryStore,
		jidDecode,
		proto,
		getContentType,
		downloadContentFromMessage,
		fetchLatestWaWebVersion
	} = require("@adiwajshing/baileys");
	const fs = require("fs");
	const http = require("http")
	const pino = require("pino");
	const lolcatjs = require('lolcatjs')
	const path = require('path')
	const NodeCache = require("node-cache");
	const msgRetryCounterCache = new NodeCache();
	const fetch = require("node-fetch")
	const FileType = require('file-type')
	const _ = require('lodash')
	const {
		Low,
		JSONFile
	} = require('./lib/lowdb')
	const {
		mongoDB
	} = require('./lib/mongoDB.js')
	const {
		Boom
	} = require("@hapi/boom");
	const PhoneNumber = require("awesome-phonenumber");
	const readline = require("readline");
	const {
		smsg,
		color,
		getBuffer,
		parseMentions,
		sleep
	} = require("./lib/myfunc")
	const {
		imageToWebp,
		videoToWebp,
		writeExifImg,
		writeExifVid
	} = require('./lib/exif')
	const {
		toAudio,
		toPTT,
		toVideo
	} = require('./lib/converter')
	const Cfonts = require('cfonts')
	Cfonts.say('LIYS-BOT',{font: 'tiny', align: 'center'})
	Cfonts.say('CREATED by NdyZz',{font: 'console', align: 'center'})
	Cfonts.say('wa.me/6285346923840',{font: 'console', align: 'center'})
	//http.createServer((_, res) => res.end("Uptime!")).listen(8080)
	const store = makeInMemoryStore( {
		logger: pino().child({
			level: "silent", stream: "store"
		})
	});
	const PORT = process.env.PORT || process.env.SERVER_PORT || 5000
	const connect = require('./server.js');
	//const startServer = server.default;

	connect(PORT);

  global.premium = JSON.parse(fs.readFileSync('./src/db/premium.json'));
  global.sewa = JSON.parse(fs.readFileSync('./src/db/sewa.json'));
  global.stickerBlocked = JSON.parse(fs.readFileSync('./src/db/sticker-blocked.json'));
	global.db = new Low(
		global.urldb !== ''? new mongoDB(urldb, "deadheart"):
		new JSONFile(`./src/database.json`), {}
	)
	global.DATABASE = global.db
	global.loadDatabase = async function loadDatabase() {
		if (global.db.READ) return new Promise((resolve) => setInterval(function () {
			(!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase(): global.db.data)): null)
		}, 1 * 1000))
		if (global.db.data !== null) return
		global.db.READ = true
		await global.db.read()
		global.db.READ = false
		global.db.data = {
			users: {},
			chats: {},
			menfess: {},
			historys: {},
			games: {},
			settings: {},
			...(global.db.data || {})
		}
		global.db.chain = _.chain(global.db.data)
	}
	loadDatabase()

	function createTmpFolder() {
		const folderName = "tmp";
		const folderPath = path.join(__dirname, folderName);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
			lolcatjs.fromString(`Folder '${folderName}' berhasil dibuat.`);
		} else {
			lolcatjs.fromString(`Folder '${folderName}' sudah ada.`);
		}
	}
	createTmpFolder();

	const usePairingCode = true
	const question = (text) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return new Promise((resolve) => {
			rl.question(text, resolve)
		})
	};

	async function startBotz() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState("session")
		const ptz = makeWASocket( {
			logger: pino( {
				level: "silent"
			}),
			printQRInTerminal: !usePairingCode,
			auth: state,
			msgRetryCounterCache,
			connectTimeoutMs: 60000,
			defaultQueryTimeoutMs: 0,
			keepAliveIntervalMs: 10000,
			emitOwnEvents: true,
			fireInitQueries: true,
			generateHighQualityLinkPreview: true,
			syncFullHistory: true,
			markOnlineOnConnect: true,
			browser: ["NdyZz", "Chrome", "20.0.04"],
		});
		if (usePairingCode && !ptz.authState.creds.registered) {
			let phoneNumber;
			if (!NumberBot) {
				phoneNumber = await question('Masukan Nomer Yang Aktif Awali Dengan 62 :\n');
			} else {
				phoneNumber = NumberBot;
			}
			phoneNumber.replace(/[^0-9]/g, '')
			console.log(phoneNumber);
			setTimeout(async () => {
				let code = await ptz.requestPairingCode(phoneNumber)
				code = code?.match(/.{1,4}/g)?.join("-") || code
				console.log(`Pairing code: ${code}`)
			}, 3000)
		}

		store.bind(ptz.ev);
		ptz.ev.on('call', async (celled) => {
		  const melah = await ptz.decodeJid(ptz.user.id)
		  if (global.db.data.settings[melah].anticall) {
		    console.log(celled)
		    for (let kopel of celled) {
		      if (kopel.isGroup == false) {
		        if (kopel.status == "offer") {
		          const crotor = (kopel && kopel?.from && [melah, ...global.nomerowner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(kopel?.from)) || false;
		          if (crotor) return
		          //await ptz.rejectCall(kopel.from);
		          const tek = `*${ptz.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner untuk membuka blok !`
		          const nomer = await ptz.sendContactArray(kopel.from,[[`${owner}`, `${await ptz.getName(owner+'@s.whatsapp.net')}`, `💌 Developer Bot `, `ɴᴏᴛ ғᴀᴍᴏᴜs ᴊᴜsᴛ ᴀʟᴏɴᴇ ʙᴏʏ`, `sandikurniawan12042004@gmail.com`, `🇮🇩 Indonesia`, `📍 https://github.com/NdyZz`, `👤 ᴏᴡɴᴇʀ Liys`],[`${NumberBot}`, `${await ptz.getName(ptz.user.id)}`, `🎈 ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ`, `📵 ᴅᴏɴᴛ sᴘᴀᴍ/ᴄᴀʟʟ ᴍᴇ 😢`, `ɴᴏᴛʜɪɴɢ`, `🇮🇩 Indonesia`, `📍 https://github.com/NdyZz`, `ʜᴀɴʏᴀ ʙᴏᴛ ʙɪᴀsᴀ ʏᴀɴɢ ᴋᴀᴅᴀɴɢ sᴜᴋᴀ ᴇʀʀᴏʀ ☺`]], null)
		          await ptz.sendMessage(kopel.from,{text: tek, mentions: await parseMentions(tek)}, {quoted:nomer})
		          await sleep(5000)
		          await ptz.updateBlockStatus(kopel.from, "block")
		        }
		      }
		    }
		  }
		})
		ptz.ev.on('group-participants.update', async (anu) => {
		  console.log(anu)
		  for (const lot of anu.participants) {
		    let pp = await ptz.profilePictureUrl(lot, 'image').catch((_) => ppkosong)
		    let user = await ptz.getName(lot) || lot || ""
		    let metadata = await ptz.groupMetadata(anu.id).catch(e => {});
		    let gcname = metadata?.subject || anu.id || ""
  		  if (anu.action === "add") {
  		    if (global.db.data.chats[anu.id].welcome) {
  		      const welcome = `Hi @${lot.split("@")[0]}, Welcome to ${gcname}`;
    		    try {
              await ptz.sendMessage(anu.id, {image: {url: pp}, caption: welcome, mentions: await parseMentions(welcome)})
    		    } catch (e) {
    		      await ptz.sendMessage(anu.id, {text: welcome, mentions: await parseMentions(welcome)})
    		    }
  		    }
  		  }
  		  if (anu.action === "remove") {
  		    if (global.db.data.chats[anu.id].goodbay) {
  		      const goodbay = `Goodbye @${lot.split("@")[0]} 👋`;
    		    try {
              await ptz.sendMessage(anu.id, {image: {url: pp}, caption: goodbay, mentions: await parseMentions(goodbay)})
    		    } catch (e) {
    		      await ptz.sendMessage(anu.id, {text: goodbay, mentions: await parseMentions(goodbay)})
    		    }
  		    }
  		  }
  		  if (anu.action === "promote") {
  		    const promote = `@${lot.split("@")[0]} *Promote* to Admin`;
  		    try {
            await ptz.sendMessage(anu.id, {image: {url: pp}, caption: promote, mentions: await parseMentions(promote)})
  		    } catch (e) {
  		      await ptz.sendMessage(anu.id, {text: promote, mentions: await parseMentions(promote)})
  		    }
  		  }
  		  if (anu.action === "demote") {
  		    const demote = `@${lot.split("@")[0]} *Demote* from Admin`;
  		    try {
            await ptz.sendMessage(anu.id, {image: {url: pp}, caption: demote, mentions: await parseMentions(demote)})
  		    } catch (e) {
  		      await ptz.sendMessage(anu.id, {text: demote, mentions: await parseMentions(demote)})
  		    }
  		  }
		  }
		})

		ptz.ev.on("messages.upsert", async (chatUpdate) => {
			try {
				const mek = chatUpdate.messages[0]
				if (!mek.message) return
				mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message: mek.message
				if (mek.key && mek.key.remoteJid === 'status@broadcast') {
					await ptz.readMessages([mek.key])
				}
				if (!ptz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
				if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
				const m = smsg(ptz, mek, store)
				require("./case")(ptz, m, chatUpdate, store)
			} catch (err) {
				console.log(err)
			}
		});

		// Setting
		ptz.decodeJid = (jid) => {
			if (!jid) return jid;
			if (/:\d+@/gi.test(jid)) {
				let decode = jidDecode(jid) || {};
				return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
			} else return jid;
		};

		ptz.ev.on("contacts.update", (update) => {
			for (let contact of update) {
				let id = ptz.decodeJid(contact.id);
				if (store && store.contacts) store.contacts[id] = {
					id,
					name: contact.notify
				};
			}
		});

		ptz.getName = (jid,
			withoutContact = false) => {
			id = ptz.decodeJid(jid);
			withoutContact = ptz.withoutContact || withoutContact;
			let v;
			if (id.endsWith("@g.us"))
				return new Promise(async (resolve) => {
				v = store.contacts[id] || {};
				if (!(v.name || v.subject)) v = ptz.groupMetadata(id) || {};
				resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
			});
			else
				v =
			id === "0@s.whatsapp.net"
			? {
				id,
				name: "WhatsApp",
			}: id === ptz.decodeJid(ptz.user.id)
			? ptz.user: store.contacts[id] || {};
			return (withoutContact ? "": v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
		};

		ptz.public = true;

		ptz.serializeM = (m) => smsg(ptz, m, store)

		ptz.ev.on('connection.update', async (update) => {
			const {
				connection,
				lastDisconnect
			} = update
			try {
				if (connection === 'close') {
					let reason = new Boom(lastDisconnect?.error)?.output.statusCode
					if (reason === DisconnectReason.badSession) {
						console.log(`Bad Session File, Please Delete Session and Verifikasi Again`); ptz.logout();
					} else if (reason === DisconnectReason.connectionClosed) {
						console.log("Connection closed, reconnecting...."); startBotz();
					} else if (reason === DisconnectReason.connectionLost) {
						console.log("Connection Lost from Server, reconnecting..."); startBotz();
					} else if (reason === DisconnectReason.connectionReplaced) {
						console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); ptz.logout();
					} else if (reason === DisconnectReason.loggedOut) {
						console.log(`Device Logged Out, Please Verifikasi Again And Run.`); ptz.logout();
					} else if (reason === DisconnectReason.restartRequired) {
						console.log("Restart Required, Restarting..."); startBotz();
					} else if (reason === DisconnectReason.timedOut) {
						console.log("Connection TimedOut, Reconnecting..."); startBotz();
					} else ptz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
				} if (update.connection == "open" || update.receivedPendingNotifications == "true") {
					lolcatjs.fromString('Connect, welcome owner!')
					lolcatjs.fromString(`Connected to = ` + JSON.stringify(ptz.user, null, 2))
				}
			} catch (err) {
				console.log('Error Di Connection.update '+err)
			}
		})

		ptz.ev.on("creds.update",
			saveCreds);
			
		ptz.parseMentions = parseMentions;
		
		ptz.sendTextWithMentions = async (jid, text, quoted, options = {}) => {
		  await ptz.sendMessage(jid, {text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options}, {quoted})
		}

		ptz.sendContactArray = async (jid, data, quoted, options) => {
			if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
			let contacts = []
			for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
				number = number.replace(/[^0-9]/g, '')
				let njid = number + '@s.whatsapp.net'
				let biz = await ptz.getBusinessProfile(njid).catch(_ => null) || {}
				// N:;${name.replace(/\n/g, '\\n').split(' ').reverse().join(';')};;;
				let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
item2.EMAIL;type=INTERNET:${isi2}
item2.X-ABLabel:📧 Email
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:📍 Region
item4.URL:${isi4}
item4.X-ABLabel:Website
item5.X-ABLabel:${isi5}
END:VCARD`.trim()
				contacts.push({
					vcard, displayName: name
				})
			}
			return await ptz.sendMessage(jid, {
				contacts: {
					displayName: (contacts.length > 1 ? `2013 kontak`: contacts[0].displayName) || null,
					contacts,
				}
			},
				{
					quoted,
					...options
				})
		}
		
		ptz.sendMessageToNewsLetter = async (jid, text, options = {}) => {
		  const messages = {
		    extendedTextMessage: {
		      text: text,
		      ...options
		    }
		  }
		  const messageToChannel = await proto.Message.encode(messages).finish()
		  const result = {
		    tag: 'message',
		    attrs: { to: jid, type: 'text' },
		    content: [
		      {
		        tag: 'plaintext',
		        attrs: {},
		        content: messageToChannel
		      }
		    ]
		  }
		  return ptz.query(result)
		}
		
		ptz.reply = async (jid, text = "", quoted, options) => {
		  return Buffer.isBuffer(text) ? ptz.sendFile(jid, text, "file", "", quoted, false, options) : ptz.sendMessage(jid, {text, mentions: await parseMentions(text), ...options}, { quoted });
    };

		ptz.getFile = async (PATH, returnAsFilename) => {
			let res,
			filename
			const data = Buffer.isBuffer(PATH) ? PATH: /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1],
				'base64'): /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer(): fs.existsSync(PATH) ? (filename = PATH,
				fs.readFileSync(PATH)): typeof PATH === 'string' ? PATH: Buffer.alloc(0)
			if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
			const type = await FileType.fromBuffer(data) || {
				mime: 'application/octet-stream',
				ext: '.bin'
			}
			if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
				return {
				res,
				filename,
				...type,
				data,
				deleteFile() {
					return filename && fs.promises.unlink(filename)
				}
			}
		}

		ptz.downloadMediaMessage = async (message) => {
			let mime = (message.msg || message).mimetype || ''
			let messageType = message.mtype ? message.mtype.replace(/Message/gi, ''): mime.split('/')[0]
			const stream = await downloadContentFromMessage(message, messageType)
			let buffer = Buffer.from([])
			for await(const chunk of stream) {
				buffer = Buffer.concat([buffer, chunk])
			}
			return buffer
		}

		ptz.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
			let type = await ptz.getFile(path, true)
			let {
				res,
				data: file,
				filename: pathFile
			} = type
			if (res && res.status !== 200 || file.length <= 65536) {
				try {
					throw {
						json: JSON.parse(file.toString())
					}
				} catch (e) {
					if (e.json) throw e.json
				}
			}
			let opt = {
				filename
			}
			if (quoted) opt.quoted = quoted
			if (!type) options.asDocument = true
			let mtype = '',
			mimetype = type.mime,
			convert
			if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
			else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
			else if (/video/.test(type.mime)) mtype = 'video'
			else if (/audio/.test(type.mime)) (
				convert = await (ptt ? toPTT: toAudio)(file, type.ext),
				file = convert.data,
				pathFile = convert.filename,
				mtype = 'audio',
				mimetype = 'audio/ogg; codecs=opus'
			)
				else mtype = 'document'
			if (options.asDocument) mtype = 'document'

			let message = {
				...options,
				caption,
				ptt,
				[mtype]: {
					url: pathFile
				},
				mimetype
			}
			let m
			try {
				m = await ptz.sendMessage(jid, message, {
					...opt, ...options
				})
			} catch (e) {
				console.error(e)
				m = null
			} finally {
				if (!m) m = await ptz.sendMessage(jid, {
					...message, [mtype]: file
				}, {
					...opt, ...options
				})
				return m
			}
		}

		ptz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
			let buff = Buffer.isBuffer(path) ? path: /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64'): /^https?:\/\//.test(path) ? await (await getBuffer(path)): fs.existsSync(path) ? fs.readFileSync(path): Buffer.alloc(0)
			let buffer
			if (options && (options.packname || options.author)) {
				buffer = await writeExifVid(buff, options)
			} else {
				buffer = await videoToWebp(buff)
			}
			await ptz.sendMessage(jid, {
				sticker: {
					url: buffer
				}, ...options
			}, {
				quoted
			})
			return buffer
		}

		ptz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
			let quoted = message.msg ? message.msg: message
			let mime = (message.msg || message).mimetype || ''
			let messageType = message.mtype ? message.mtype.replace(/Message/gi, ''): mime.split('/')[0]
			const stream = await downloadContentFromMessage(quoted, messageType)
			let buffer = Buffer.from([])
			for await(const chunk of stream) {
				buffer = Buffer.concat([buffer, chunk])
			}
			let type = await FileType.fromBuffer(buffer)
			trueFileName = attachExtension ? (filename + '.' + type.ext): filename
			await fs.writeFileSync(trueFileName, buffer)
			return trueFileName
		}

		ptz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
			let quoted = message.msg ? message.msg: message;
			let mime = (message.msg || message).mimetype || '';
			let messageType = message.mtype ? message.mtype.replace(/Message/gi, ''): mime.split('/')[0];
			const stream = await downloadContentFromMessage(quoted, messageType);
			let buffer = Buffer.from([]);
			for await(const chunk of stream) {
				buffer = Buffer.concat([buffer, chunk]);
			}
			let type = await FileType.fromBuffer(buffer);
			let trueFileName = attachExtension ? (filename + '.' + type.ext): filename;
			let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder
			await fs.writeFileSync(savePath, buffer);
			return savePath;
		};
		
		ptz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
			let buff = Buffer.isBuffer(path) ? path: /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64'): /^https?:\/\//.test(path) ? await (await getBuffer(path)): fs.existsSync(path) ? fs.readFileSync(path): Buffer.alloc(0)
			let buffer
			if (options && (options.packname || options.author)) {
				buffer = await writeExifImg(buff, options)
			} else {
				buffer = await imageToWebp(buff)
			}
			await ptz.sendMessage(jid, {
				sticker: {
					url: buffer
				}, ...options
			}, {
				quoted
			})
			return buffer
		}

		ptz.sendText = (jid, text, quoted = '', options) => {
		  ptz.sendMessage(jid, {text: text, ...options}, {quoted})
		}
		
		return ptz;
	}
	startBotz();

	//batas
	let file = require.resolve(__filename)
	fs.watchFile(file, () => {
		fs.unwatchFile(file)
		console.log(`Update ${__filename}`)
		delete require.cache[file]
		require(file)
	})