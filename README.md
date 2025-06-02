# Documentation
1. [Create Project](#create-project)
1. [Setup Project](#setup-project)
1. [Git First Commit](#git-first-commit)
1. [Branch Level **`!Important For Developer`**](#branch-level)
1. [Git Flow Work Flow **`!Important For Developer`**](#git-first-commit)
1. [Unit Test **`!Important For Developer`**](#unit-test)
1. [Commit Pattern **`!Important For Developer`**](#commit-pattern)


# Create Project
- Using node version `v20.3.1` or above
- Create Folder service-firebase
- `npm init`
- `npm install express`
- `npm install --save-dev @types/express`
- `npm install winston`
- `npm install sequelize`
- `npm install pg`
- `npm install jsonwebtoken`
- `npm install axios`
- `npm install openai`
- `npm install multer`
- `npm install --save-dev @types/multer`
- `npm install uuid`
- `npm install --save-dev @types/uuid`
- `npm install moment`
- `npm install --save-dev @types/jsonwebtoken`
- `npm install bcrypt`
- `npm install --save-dev @types/bcrypt`
- `npm install dotenv`
- `npm install --save-dev babel-jest @babel/preset-env`
- `npm install --save-dev @babel/preset-typescript`
- `npm install jest`
- `npm install --save-dev @types/jest`
- `npm install --save-dev @jest/globals`
- `npm install --save-dev supertest @types/supertest`
- `npm install --save-dev typescript`
- Change script on package json with :
  ```json
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "transform": {
      "^.+\\.[t|j]sx?$": "babel-jest"
    }
  }
  ```

- Add on babel.config.json :

  ```json
  {
    "presets": ["@babel/preset-env"]
  } 
  ```
- update babel.config.json :

  ```json
  {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ]
  }
  ```
- `npx tsc --init`
- update tsconfig.json
  1. ```"module": "commonjs"```
  2. ```"moduleResolution": "Node"```
  3. ```"include": ["src/**/*"]```
  4. ```"outDir": "./dist"```
- `npm install ts-node`
- update package json :

  ```json
  "scripts": {
    "start":"DEBUG=* node dist/main.js",
    "test": "jest",
    "dev": "nodemon --exec ts-node --files src/main.ts",
    "build": "tsc"
  }
  ```

# Setup Project
- Create .env file :
  ```
  PORT = 3010
  ```
- Run `npm install`
- For dev watch `npm run dev`
- For build `npm run build`
- For Start `npm run start`

# Git First Commit

- `git init --initial-branch=main`
- `git remote add origin https://gitlab.groopy.id/microservices/mobile/mobile-api-usermanagement.git`
- `git add .`
- `git commit -m "Initial commit"`
- `git push --set-upstream origin main`

# Branch Level
- feature

  Berisi semua pengerjaan tahap development (pengerjaan feature, testing, working in progress), pada level ini contoh branchnya adalah **`feat-upload`, `test-fetch`, `wip-delete`**. Pada level ini, branch yang dibuat **harus bersumber dari `branch develop`**. Jika semua aman, branch ini akan dikumpulkan pada **`branch develop`**
- develop

  Setelah semua pengerjaan pada tahap feature sudah ok dari sisi developer, selanjutnya developer merge script tersebut ke branch develop untuk dikumpulkan, dan di testing pengumpulan tersebut. Pada tahap ini juga dibenarkan melakukan fixbug, minor update, dan lainnya. Sebelum melakukan perubahan pada branch ini **diharuskan untuk selalu menarik script pada `branch main` dan/atau `branch hotfixes`**. Jika semua aman, branch ini ditarik ke branch **`release`**

- release

  Script pada tahap ini, akan dilakukan pengecekan oleh QA/QC (unit test atau manual). **Jika ada bug**, bug dikerjakan di branch develop (TURUN LEVEL). **BISAKAN AGAR TIDAK MELAKUKAN PERUBAHAN** pada branch relase kecuali hanya menarik dari branch develop. **Jika aman**, maka akan diteruskan ke **`branch main`**. Saat diteruskan ke **`branch main`**, disarankan membuat **`tag`** dengan penamaan release version pada branch ini, contoh **`release-1.0.0`**

- hotfixes
  
  Level ini **HANYA BOLEH** menarik source dari **`branch main`**, jika saat script yang sedang running ditemukan bug. Pengerjaan yang dilakukan di level ini sifatnya **`MENDESAK`**. Pengerjaan harus diselesaikan sesegera mungkin **`(ASAP)`**. Setelah selesai sourcenya dikirim ke **`branch main`** dan **`branch develop`**
- main
  
  Source pada level ini, adalah source yang sedang running. **`Tidak peduli`** anda menjalankannya di **`Staging`** atau **`Production`**. Karna source stag dan prod seharusnya sama, yang membedakan hanya environtment datanya saja.

# Git Flow Work Flow
- Sebelum mulai pengerjaan, rencanakan secara matang parameter apa yang akan diterima, response apa yang akan diberikan, bisnis logic apa yang akan diterapkan. Disarankan membuat API spec (lihat contoh pada folder doc), untuk memudahkan perubahan, perbaikan dan pengembangan
- Buat branch baru, beri nama sesuai dengan apa yang akan dikerjakan. Disarankan mengikuti kaedah berikut :
  - hotfix-[name] => memperbaiki masalah kritis dengan cepat,
  biasanya dengan solusi sementara

  - bugfix-[name] => memperbaiki bug

  - feature-[name] => menambah, menghapus, atau memodifikasi fitur

  - test-[name] => bereksperimen sesuatu yang tidak menjadi masalah

  - wip-[name] => suatu pekerjaan yang sedang berlangsung (Work In Progress)
- **TIDAK DIBENARKAN MELAKUKAN LEBIH DARI 1 PENGERJAAN, JIKA ANDA MENDAPAT TASK UPDATE FEATURE DAN BUG SECARA BERSAMAAN, SELESAIKAN SATU PERSATU, JIKA TERPAKSA, PASTIKAN ADA MEMBUAT 2 BRANCH, DAN PUSH KE BRANCH YANG BERBEDA**
- Push pekerjaan yang belum selesai tidak masalah, selama tidak di merge ke staging atau main

# Unit Test
- Pastikan Agar selalu membuat unit test dari service yang telah dikerjakan, agar memudahkan untuk proses mengecekan
- Unit test hukumnya Sunnah mendekati Wajib, harap diperhatikan!!
- Bertanya atau lihat contoh file testing yang ada pada repo ini.

# Commit Pattern
- Tolong jangan asal - asalan dalam menulis commit message
- Ikuti pedoman commit message yang baik, salah satunya yang digunakan pada repo ini adalah [convention message](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)




[^Created By]: WIM @ PT. Kandara Digita Kreatif
