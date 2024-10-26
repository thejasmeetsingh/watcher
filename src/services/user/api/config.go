package api

import (
	"github.com/jackc/pgx/v5"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

type APIConfig struct {
	DB      *pgx.Conn
	Queries *database.Queries
}

func GetPromRequestTotal() *prometheus.CounterVec {
	httpRequestsTotal := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests.",
		},
		[]string{"handler", "method"},
	)

	return httpRequestsTotal
}

func GetPromRequestDuration() *prometheus.HistogramVec {
	httpRequestDuration := prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds.",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"handler", "method"},
	)
	return httpRequestDuration
}
