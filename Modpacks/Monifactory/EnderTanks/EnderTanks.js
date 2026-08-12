
class EnderTanks {
  ENDER_TANKS_PATH = '../data/EnderTanks.json';
  
  onInit() {
    this.initTable();
    this.initForm();
  }

  enderTanks;
  tankTable;

  async initTable() {
    let enderTanks = this.parseData(await MinecraftCdn.fetchJson(this.ENDER_TANKS_PATH));
    this.enderTanks = enderTanks;
    let tankTable = document.getElementById('enderTankTable');
    this.tankTable = tankTable;

    tankTable.innerHTML = '<tr><th class="hex-column">Hex</th><th class="color-column">Color</th><th class="fluid-column">Fluid</th><tr>'
  
    for (let tank of enderTanks) {
      this.tankTable.appendChild(tank.getTr());
    }
  }

  initForm() {
    const addTankButton = document.getElementById('addTankButton')
    console.log(addTankButton);
    addTankButton.addEventListener('click', async (event) => {
      let code = '';
      document.querySelectorAll('select').forEach(select => {
        code = code.concat(select.value)
      });

      let fluid = document.getElementById('fluidInput').value;

      const enderTank = new EnderTank(code, fluid);
      const response = await MinecraftCdn.addEnderTank(enderTank);
      
      if (response.status === 201) {
        this.clearTable();
        await this.initTable();
      } else {
        const body = await response.text();
        alert(`${response.status} - ${body}`);
      }
    });
  }

  clearTable() {
    while(this.tankTable.lastChild) {
      this.tankTable.removeChild(this.tankTable.lastChild)
    }
  }

  parseData(data) {
    let parsedData = [];
  
    data.forEach(entry => {
      parsedData.push(new EnderTank(entry.code, entry.fluid))
    });
  
    return parsedData;
  }
}

function onLoad() {
  const enderTanks = new EnderTanks();
  enderTanks.onInit();
}