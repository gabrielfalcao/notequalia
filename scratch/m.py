import smtplib

server = smtplib.SMTP('127.0.0.1', 8825)
# server.set_debuglevel(1)
for x in range(100):
    server.sendmail(f"user{x}@gmail.com", f"note-{x}@cognod.es", 'This note is great')

server.quit()
