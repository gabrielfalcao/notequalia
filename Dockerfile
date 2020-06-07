FROM gabrielfalcao/notequalia-io-base

RUN apk --update --no-cache add \
    git


VOLUME /notequalia.io

ENV VENV /venv/
ENV PATH "/venv/bin:${PATH}"
ENV PYTHONPATH /app/
ENV UPLOAD_FOLDER /notequalia.io/file-uploads

COPY . /app/

RUN /venv/bin/pip install -U pip setuptools wheel
RUN /venv/bin/pip install /app

RUN make tests

RUN notequalia-io check
ENV CAHOOTS_IN_PORT 5000
ENV CAHOOTS_IN_VERSION 4

EXPOSE 5000
EXPOSE 4242
EXPOSE 6969


CMD notequalia-io web "--port=$CAHOOTS_IN_PORT"
CMD /venv/bin/uwsgi --http ":$CAHOOTS_IN_PORT" --mount /=application.web:application
