import http.server
from http import HTTPStatus
import socketserver
import json
from types import SimpleNamespace

PORT = 9624
MODPACKS_PATH = 'Modpacks'
MONIFACTORY_PATH = MODPACKS_PATH + '/Monifactory'

class EnderTank:
    def __init__(self, code, fluid):
        self.code = code
        self.fluid = fluid

    code: str
    fluid: str

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_type = self.headers.get_content_type()
        response_code: int = HTTPStatus.BAD_REQUEST
        response_message: str = ''

        try:
            if content_type.startswith('application/json'):
                content_length = int(self.headers.get('Content-Length', 0))
                request_body = json.loads(
                    self.rfile.read(content_length), 
                    object_hook=lambda d: SimpleNamespace(**d)
                )

                if self.path == '/modpacks/monifactory/ender-tank':
                    response_code = self.createEnderTank(EnderTank(request_body.code, request_body.fluid))
        except ValueError as err:
            response_message = str(err)

        self.send_response(response_code)
        self.end_headers()

        if len(response_message) > 0:
            self.wfile.write(response_message.encode())

    def do_DELETE(self):
        if self.path.startswith('/modpacks/monifactory/ender-tank'):
            code_to_delete = self.path.split('/')[-1]
            if len(code_to_delete) == 3:
                self.deleteEnderTankByCode(code_to_delete)
            else:
                self.send_response(HTTPStatus.BAD_REQUEST)
                self.wfile.write(f'Invalid code {code_to_delete}'.encode())

    def deleteEnderTankByCode(self, code):
        path = f'{MONIFACTORY_PATH}/data/EnderTanks.json'
        ender_tanks = readJson(path)
        reduced_tanks = filter(lambda t: t['code'] != code, ender_tanks)
        writeJson(path, list(reduced_tanks))
        self.send_response(HTTPStatus.OK)
        self.end_headers()

    def createEnderTank(self, ender_tank: EnderTank):
        print(ender_tank.code)
        print(ender_tank.fluid)

        if len(ender_tank.code) != 3:
            raise ValueError('Code length must be exactly 3')
        if len(ender_tank.fluid) == 0:
            raise ValueError('Fluid can\'t be empty')

        path = f'{MONIFACTORY_PATH}/data/EnderTanks.json'

        ender_tanks = readJson(path)

        if any(tank["code"] == ender_tank.code for tank in ender_tanks):
            raise ValueError(f'Code "{ender_tank.code}" already exists')

        ender_tanks.append({
            'code': ender_tank.code, 
            'fluid': ender_tank.fluid
        })

        ender_tanks.sort(key=lambda x: x['code'])

        writeJson(path, ender_tanks)

        return HTTPStatus.CREATED

def readJson(path: str):
    with open(path, 'r') as file:
        return json.load(file)

def writeJson(path: str, data):
    with open(path, 'w') as file:
        json.dump(data, file, indent=4)

def main():
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print(f'Serving at port {PORT}')
        httpd.serve_forever()

main()