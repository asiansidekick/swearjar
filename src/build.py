# Builds ../index.html from shell.html + qrcode.js + app.js, with icon.png inlined. Run from this folder: python3 build.py
import base64
s=open('shell.html').read()
ic=base64.b64encode(open('icon.png','rb').read()).decode()
s=s.replace('<!--ICON-->','<link rel="apple-touch-icon" href="data:image/png;base64,'+ic+'">\n<link rel="icon" href="data:image/png;base64,'+ic+'">')
s=s.replace('<!--QR-->','/* qrcode-generator 1.4.4, MIT licence, Kazuhiko Arase */\n'+open('qrcode.js').read())
s=s.replace('<!--APP-->',open('app.js').read())
open('../index.html','w').write(s)
print(len(s))
