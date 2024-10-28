from prometheus_client import Counter, Histogram


def get_http_request_total() -> Counter:
    """
    Get prometheus counter for HTTP requests
    """

    http_request_total = Counter(
        name="http_requests_total",
        documentation="Total number of HTTP requests.",
        labelnames=["method", "path"]
    )
    return http_request_total


def get_http_request_duration() -> Histogram:
    """
    Get prometheus histogram for HTTP requests duration
    """

    http_request_duration = Histogram(
        name="http_request_duration_seconds",
        documentation="HTTP request duration in seconds.",
        labelnames=["method", "path", "status"]
    )

    return http_request_duration
