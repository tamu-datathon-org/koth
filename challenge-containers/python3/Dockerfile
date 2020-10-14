FROM ubuntu:latest

# Adapted from: https://hackernoon.com/building-python-data-science-container-using-docker-c8e346295669

WORKDIR /var/www/

ENV PYTHON_PACKAGES="\
    numpy==1.18.5 \
    matplotlib \
    scipy \
    scikit-learn \
    plotly \
    torch \
    tensorflow \
    seaborn \
    keras \
    pandas \
    nltk \
    Theano \
    pyspark \
    " 

RUN apt-get update
RUN apt-get install -y python3-pip
RUN pip3 install --no-cache-dir $PYTHON_PACKAGES

CMD ["python3"] 