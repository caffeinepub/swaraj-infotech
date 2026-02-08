# Learner Tests API Documentation

This document describes the backend API methods available for learner test capabilities, including chapter tests and exam mode. It covers method signatures, payload/response shapes, authorization requirements, and implementation details.

## Overview

The Swaraj Infotech application supports two types of tests:
1. **Chapter Tests**: Focused practice tests on specific chapters with configurable question count and time limits
2. **Exam Mode**: Full course exams simulating real exam conditions with course-specific rules

Both test types share common infrastructure but differ in scope and configuration.

## Authentication & Authorization

All test-related endpoints require authentication via Internet Identity. Unauthenticated requests will trap with an error message: `"Unauthorized: Only authenticated users can [action]"`.

The backend verifies that the caller has the `#user` permission before allowing access to test operations.

## Chapter Tests API

### Start Chapter Test

**Method**: `startChapterTest(course: string, chapter: string, questionCount?: number, timeLimit?: number): Promise<ChapterTestSession>`

Starts a new chapter test session with the specified parameters.

**Parameters**:
- `course` (required): Course identifier (`"MSCIT"` or `"GCC-TBC"`)
- `chapter` (required): Chapter name to test
- `questionCount` (optional): Number of questions (default: 20)
- `timeLimit` (optional): Time limit in seconds (default: 1200 = 20 minutes)

**Response**: `ChapterTestSession`
