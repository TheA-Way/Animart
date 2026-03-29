<div align="center">

<pre>
 █████╗ ███╗   ██╗██╗███╗   ███╗ █████╗ ██████╗ ████████╗
██╔══██╗████╗  ██║██║████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝
███████║██╔██╗ ██║██║██╔████╔██║███████║██████╔╝   ██║   
██╔══██║██║╚██╗██║██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║   
██║  ██║██║ ╚████║██║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   
╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
                                                           
            ⛩️  P R E M I U M  A N I M E  M E R C H  ⛩️
</pre>

<video src="readme/DomainExpansion.mp4" autoplay loop muted width="500"></video>


<br/>

<img src="https://skillicons.dev/icons?i=python,fastapi,postgres,docker,react,typescript,tailwind&theme=dark" />

<br/><br/>

**Try it Now: [animart-wine.vercel.app](animart-wine.vercel.app)**

</div>

---

<div align="center">

# AniMart — Scalable Anime Merch Store

**A full-stack e-commerce platform built to solve real distributed systems problems — not just move data in and out of a database.**

</div>

> [!NOTE]
> The backend seeds a test user and cart automatically on startup. The Gojo Satoru Figure has a stock of **1** — try buying it twice to see the stock validation and row-level locking in action.

---

## ✨ Engineering Highlights

- **⚛️ Atomic Transactions** — Stock deduction, order creation, and cart clearing happen inside a single database transaction. If any step fails, a full `ROLLBACK` fires and the database is left untouched
- **🔒 Row-Level Locking** — Uses PostgreSQL's `SELECT ... FOR UPDATE` to lock product rows during checkout. Two users simultaneously buying the last item? Only one succeeds — the other gets a clean "Insufficient stock" error, not corrupted data
- **🛡️ Deadlock Prevention** — Product IDs are sorted before locking, guaranteeing all transactions acquire locks in the same order and eliminating the possibility of circular waits
- **🔑 Idempotency** — Every order requires a unique `idempotency_key`. Double-clicking checkout, network retries, or duplicate requests will never create a second charge — the original order is returned instead
- **📦 Docker Compose** — The entire backend stack (Python app + PostgreSQL) spins up with one command

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript | Component-based UI with type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Backend | Python 3.11 + FastAPI | Async REST API with auto-generated docs |
| ORM | SQLAlchemy 2.0 | Database access with row-level locking support |
| Database | PostgreSQL 15 | ACID-compliant relational database |
| Auth | Passlib + bcrypt | Secure password hashing |
| Containerization | Docker + Docker Compose | Reproducible local development environment |
| Deployment | Vercel (frontend) + Railway (backend) | Cloud hosting |
| Version Control | GitHub | Source control |

---


<div align="center">

## Credits
<a target="_blank" href="https://icons8.com/icon/XyXZ0ym1tSKu/cinnamoroll">Cinnamoroll</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

</div>


<div align="center">
© Tejiri Ewherido | All Rights Reserved
</div>
