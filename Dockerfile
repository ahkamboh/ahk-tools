# syntax = docker/dockerfile:1

# Match Ruby in Gemfile / .ruby-version
ARG RUBY_VERSION=3.1.0
# Match Bundler version to the one in Gemfile.lock (BUNDLED WITH)
ARG BUNDLER_VERSION=2.5.3

FROM registry.docker.com/library/ruby:${RUBY_VERSION}-slim AS base
WORKDIR /rails

# Production env + don't build dev/test gems
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT="development:test" \
    RAILS_LOG_TO_STDOUT=1 \
    RAILS_SERVE_STATIC_FILES=1

# ---------- Build stage ----------
FROM base AS build

# Add this line to redefine the ARG in this stage
ARG BUNDLER_VERSION

# System deps to compile gems (pg) & assets
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential git pkg-config libpq-dev postgresql-client libvips nodejs && \
    rm -rf /var/lib/apt/lists/*

# Use the exact Bundler version that Gemfile.lock expects
RUN gem install bundler -v ${BUNDLER_VERSION}

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle _${BUNDLER_VERSION}_ install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# App source
COPY . .

# Bootsnap precompile for app code
RUN bundle exec bootsnap precompile app/ lib/

# Assets (don’t require master key for precompile)
RUN SECRET_KEY_BASE_DUMMY=1 bundle exec rake assets:precompile

# ---------- Runtime stage ----------
FROM base

# Runtime libs only (libpq5 for pg, libvips for ActiveStorage variants, curl for health/debug)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      libpq5 libvips curl && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Copy installed gems and app from build stage
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Non-root user
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /rails db log storage tmp
USER rails:rails

# Prepare DB on boot (Rails template script)
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose the app port; Puma/rails will read PORT from env (configure in puma.rb)
EXPOSE 3000

# Start server (you can switch to puma -C config/puma.rb if you prefer)
CMD ["./bin/rails", "server"]
