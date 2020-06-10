FROM gabrielfalcao/cognodes-io-base

RUN apk --update --no-cache add \
    git


VOLUME /cognodes.io

ENV VENV /venv/
ENV PATH "/venv/bin:${PATH}"
ENV PYTHONPATH /app/
ENV UPLOAD_FOLDER /cognodes.io/file-uploads

COPY . /app/

RUN /venv/bin/pip install -U pip setuptools wheel
RUN /venv/bin/pip install /app

RUN make tests

RUN cognodes-io check
ENV COGNOD_ES_PORT 5000
ENV COGNOD_ES_VERSION 4

EXPOSE 5000
EXPOSE 4242
EXPOSE 6969


CMD cognodes-io web "--port=$COGNOD_ES_PORT"
CMD /venv/bin/uwsgi --http ":$COGNOD_ES_PORT" --mount /=application.web:application
