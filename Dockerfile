FROM gabrielfalcao/cahoots-in-base

RUN apk --update --no-cache add \
    git


VOLUME /notequalia.app

ENV VENV /venv/
ENV PATH "/venv/bin:${PATH}"
ENV PYTHONPATH /app/
ENV UPLOAD_FOLDER /notequalia.app/file-uploads

COPY . /app/

RUN /venv/bin/pip install -U pip setuptools wheel
RUN /venv/bin/pip install /app

RUN make tests

RUN cahoots-in check
ENV CAHOOTS_IN_PORT 5000
ENV CAHOOTS_IN_VERSION 4

EXPOSE 5000
EXPOSE 4242
EXPOSE 6969


CMD cahoots-in web "--port=$CAHOOTS_IN_PORT"
CMD /venv/bin/uwsgi --http ":$CAHOOTS_IN_PORT" --mount /=application.web:application
