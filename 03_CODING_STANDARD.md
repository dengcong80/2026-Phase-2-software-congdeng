# Coding Standards

## General Principles

Follow

SOLID

KISS

DRY

YAGNI

Clean Architecture

Clean Code

---

## Naming

Classes

PascalCase

Methods

PascalCase

Properties

PascalCase

Variables

camelCase

Private Fields

_camelCase

Constants

UPPER_CASE

---

## File Naming

One class

One file

One component

One file

---

## Backend

Controllers

Only HTTP

No Business Logic

Services

Business Logic Only

Repositories

Database Access Only

DTO

No Business Logic

Entity

No HTTP

---

## React

One Component

One Responsibility

No component over 250 lines

No page over 500 lines

Extract reusable components

Use hooks

Avoid prop drilling

Use Zustand

---

## API

RESTful

Plural naming

/api/users

/api/quests

/api/posts

/api/comments

---

## Error Handling

Global Exception Middleware

Meaningful Error Messages

Never expose stack trace

---

## Validation

Backend

FluentValidation

Frontend

React Hook Form

---

## Unit Test

Every Service

Every Repository

Critical Components

Coverage

>80%

---

## Git Commit

feat:

fix:

style:

test:

docs:

refactor:

---

## Comments

Write comments only when necessary.

Prefer readable code.

---

## Documentation

Every public class

XML Comment

Every API

Summary

Parameters

Response

---

## Folder Structure

Never change folder structure.

Follow architecture exactly.

---

## AI Rules

The AI must

Never refactor unrelated files.

Never rename folders.

Never rewrite working code.

Never optimize without request.

Never generate pseudo code.

Always generate complete implementation.