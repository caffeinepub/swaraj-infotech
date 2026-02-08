# PostgreSQL DDL Documentation

This document provides production-ready PostgreSQL DDL (Data Definition Language) statements for the Swaraj Infotech application. While the actual backend uses Motoko canister storage on the Internet Computer, this schema serves as a reference for understanding the data model and can be used for external analytics, reporting, or migration purposes.

## Overview

The schema consists of six main tables representing users, questions, tests, test questions, bookmarks, and notifications. All tables include appropriate primary keys, foreign keys, indexes, and constraints to ensure data integrity and query performance.

## Schema Definition

### Users Table

Stores user profile information including authentication details.

