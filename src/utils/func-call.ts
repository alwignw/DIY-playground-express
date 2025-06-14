export async function getName() {
    // Bisa query database, API, dll
    return {
        name : 'alwi'
    };
  }

  export async function getDate() {
    // Bisa query database, API, dll
    return {
        tanggal : new Date()
    };
  }