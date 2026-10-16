# PassTrack

**A Web-Based Academic Status and Deficiency Monitoring Portal for Enrolled Subjects**

PassTrack helps students of the College of Information Technology Education (CITE), Nueva Vizcaya State University, see their standing in each enrolled subject early in the semester. Instructors record scores and attendance, and the system computes each student's estimated standing, flags deficiencies, and shows a Red, Amber, or Green status with a text label.

## Team

- Mike James Lalica
- Alcris Joshua Pelmoka
- Dixter Ballaso

BSIT, Network Development Management, Nueva Vizcaya State University

## Features

- **Student view:** list of enrolled subjects with status, estimated standing, estimated grade, instructor, schedule, and room. Each subject shows its score breakdown and deficiencies.
- **Faculty view:** each instructor sees only their own subjects. Scores, absences, and missing requirements can be edited, or uploaded through an Excel class record. A template can be downloaded.
- **Admin view:** summary of all students and subjects, a list of students needing attention, and an Excel export of the full report.
- **Automatic computation:** weighted average per subject (Quizzes 30%, Activities 20%, Exams 40%, Attendance 10%), converted to the 1.00 to 5.00 grading scale.
- **RAG status with text labels** (not color alone):

| Status | Label | Criteria |
|---|---|---|
| Green | On Track | Standing is 80% or higher with no missing requirements and absences within the limit |
| Amber | At Risk | Standing from 75% to below 80%, or missing requirements, or absences near the limit |
| Red | Critical | Standing below 75%, or absences beyond the limit |

The standing shown is an estimate for monitoring only. It is not the official grade.

## Tech Stack

- HTML, CSS, JavaScript
- SheetJS (Excel import and export)
- Git and GitHub, deployed on Vercel

## Project Structure

```
Passtrack/
├── inde# Passtrack
