FROM gabrielfalcao/flask-hello-base

RUN apk --update --no-cache add \
    git


ENV VENV /venv/
ENV PATH "/venv/bin:${PATH}"
ENV PYTHONPATH /app/

COPY . /app/

RUN /venv/bin/pip install /app
RUN /venv/bin/pip install uwsgi

RUN make tests

RUN cahoots-in check
ENV CAHOOTS_IN_PORT 5000

ENV CAHOOTS_IN_VERSION 3

EXPOSE 5000
EXPOSE 4242
EXPOSE 6969

CMD cahoots-in web "--port=$CAHOOTS_IN_PORT"
CMD /venv/bin/uwsgi --http ":$CAHOOTS_IN_PORT" --mount /=application.web:application
