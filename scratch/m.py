import smtplib

server = smtplib.SMTP('127.0.0.1', 8825)
# server.set_debuglevel(1)
server.sendmail("hiring@google.com", "gabriel@nacaolivre.org", 'We wanna pay you big bucks to write code.')
server.quit()
