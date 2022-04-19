FROM golang:1.18-buster as build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY pkg ./pkg
RUN go build -v -o /usr/local/bin/terraform-project-api ./pkg/cmd/api


FROM debian:buster

RUN apt update
RUN apt install -y software-properties-common curl
RUN apt install -y gnupg gnupg2 gnupg1

RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add -
RUN apt-add-repository "deb [arch=$(dpkg --print-architecture)] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
RUN apt update

RUN apt install terraform

COPY --from=build /usr/local/bin/terraform-project-api /usr/local/bin/terraform-project-api

# check that we have the app
RUN which terraform-project-api

CMD ["terraform-project-api"]
