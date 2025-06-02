import winston from "winston";

export const consoleLogger = winston.createLogger({
  level: 'debug', // Level log minimal yang akan ditampilkan
  format: winston.format.combine(
    winston.format.colorize(), // Memberi warna pada log pesan yang ditampilkan di konsol
    winston.format.simple() // Format log yang sederhana untuk tampilan konsol
  ),
  transports: [
    // Menampilkan log pesan pada konsol dengan level 'debug' dan lebih tinggi
    new winston.transports.Console({ level: 'debug' })
  ]
});

// Logger untuk menyimpan log pesan pada file
export const fileLogger = winston.createLogger({
  level: 'debug', // Level log minimal yang akan disimpan
  format: winston.format.combine(
    winston.format.timestamp(), // Menambahkan timestamp pada setiap log pesan
    winston.format.json() // Format log dalam bentuk JSON
  ),
  transports: [
    // Menyimpan log pesan pada file dengan level 'info' dan lebih tinggi
    new winston.transports.File({ filename: `logs/app.log`, level: 'info' })
  ]
});