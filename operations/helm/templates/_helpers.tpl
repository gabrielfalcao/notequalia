{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "notequalia-io.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "notequalia-io.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "notequalia-io.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}

{{- define "notequalia-io.labels" -}}
app.kubernetes.io/name: {{ include "notequalia-io.name" . }}
helm.sh/chart: {{ include "notequalia-io.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
   utils
*/}}

{{- define "namespace.svc.hostname" -}}
{{- printf "%s.svc.cluster.local" .Release.Namespace -}}
{{- end -}}
{{- define "notequalia-io.web.hostname" -}}
{{ include "notequalia-io.fullname" . }}.{{ include "namespace.svc.hostname" . }}
{{- end -}}
{{- define "notequalia-io.web.fqdn" -}}
{{ include "notequalia-io.web.hostname" . }}:{{ .Values.service.port }}
{{- end -}}
{{- define "notequalia-io.zmq-queue.hostname" -}}
{{ include "notequalia-io.fullname" . }}-queue.{{ include "namespace.svc.hostname" . }}
{{- end -}}

{{- define "notequalia-io.ngrok.hostname" -}}
{{ include "notequalia-io.fullname" . }}-ngrok-tunnel.{{ include "namespace.svc.hostname" . }}
{{- end -}}

{{/*
PostgreSQL
*/}}

{{- define "postgresql.fullname" -}}
{{- printf "%s-postgresql" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- define "postgresql.hostname" -}}
{{ include "postgresql.fullname" . }}.{{ include "namespace.svc.hostname" . }}
{{- end -}}

{{/*
Redis
*/}}

{{- define "redis.fullname" -}}
{{- printf "%s-redis" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- define "redis.hostname" -}}
{{ include "redis.fullname" . }}.{{ include "namespace.svc.hostname" . }}
{{- end -}}

{{/*
Elasticsearch
*/}}

{{- define "elasticsearch.fullname" -}}
{{- printf "%s-elasticsearch" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- define "elasticsearch.hostname" -}}
{{ include "elasticsearch.fullname" . }}.{{ include "namespace.svc.hostname" . }}
{{- end -}}
