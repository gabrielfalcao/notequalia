FROM gabrielfalcao/notequalia-io-base

VOLUME /notequalia.io

ENV VENV /venv/
ENV PATH "/venv/bin:${PATH}"
ENV PYTHONPATH /app/
ENV UPLOAD_FOLDER /notequalia.io/file-uploads
ENV PIP_CACHE_DIR /pip/cache

COPY . /app/
RUN /venv/bin/pip install /app

RUN make tests

RUN notequalia-io check
ENV NOTEQUALIA_IO_PORT 5000
ENV NOTEQUALIA_IO_VERSION 4

EXPOSE 5000
EXPOSE 4242
EXPOSE 6969


CMD notequalia-io web "--port=$NOTEQUALIA_IO_PORT"
#CMD /venv/bin/uwsgi --http ":$NOTEQUALIA_IO_PORT" --mount /=application.web:application
