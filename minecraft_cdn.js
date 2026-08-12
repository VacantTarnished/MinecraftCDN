class MinecraftCdn {
  static async fetchJson(path) {
    return (await fetch(path, { cache: 'no-cache' })).json();
  }

  static async addEnderTank(enderTank) {
    return fetch('http://localhost:9624/modpacks/monifactory/ender-tank', {
      method: 'POST',
      body: JSON.stringify(enderTank),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  static async removeEnderTank(code) {
    return fetch(`http://localhost:9624/modpacks/monifactory/ender-tank/${code}`, {
      method: 'DELETE',
    })
  }
}