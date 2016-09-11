import expat from 'node-expat';
import {spawn} from 'child_process';

const ignoredElements = new Set([
    'sample', 'chip', 'device_ref', 'port', 'driver',
    'display', 'sound', 'softwarelist', 'biosset',
    'dipswitch', 'dipvalue', 'dipswitch',
    'analog', 'configuration', 'confsetting', 'device',
    'instance', 'extension', 'slot', 'slotoption',
    'ramoption', 'disk', 'adjuster',
]);

export default function parseMameContent(callback) {
    console.log('starting -> ');

    let machine, current;

    var parser = new expat.Parser('UTF-8');
    parser
        .on('error', function (e) {
            console.error('parser error: ', e);
        })
        .on('startElement', function (name, attrs) {
            if (ignoredElements.has(name)) {
                return;
            }

            switch (name) {
                case 'mame':
                    console.log(`mame v${attrs.build}`);
                    break;

                case 'machine':
                    machine = attrs;
                    break;

                case 'rom':
                    if (!('roms' in machine)) {
                        machine['roms'] = [];
                    }
                    machine['roms'].push(attrs);
                    break;

                case 'input':
                    machine['input'] = attrs;
                    break;

                case 'control':
                    if (!('controls' in machine)) {
                        machine['controls'] = [];
                    }
                    machine['controls'].push(attrs);
                    break;

                case 'driver':
                    machine['driver'] = attrs;
                    break;

                case 'description':
                case 'year':
                case 'manufacturer':
                    current = name;
                    break;

                default:
                    console.log('unhandled: ', name);
                    break;
            }
        })
        .on('text', function (text) {
            if (current) {
                if (text.trim()) {
                    machine[current] = text;
                }

                current = null;
            }
        })
        .on('endElement', function (name) {
            switch (name) {
                case 'mame':
                    console.log('done parsing mame xml file');
                    break;

                case 'machine':
                    callback(machine);
                    machine = null;
                    break;
            }
        });

    const mameProc = spawn('mame', ['-listxml'], {
        stdio: ['ignore', 'pipe', 'ignore'],
    })
        .on('close', (code, signal) => {
            console.log(`process closed with ${code} | ${signal}`);
        })
        .on('disconnect', () => {
            console.error('disconnected');
        })
        .on('error', err => {
            console.error('error: ', err);
        })
        .on('exit', (code, signal) => {
            console.log(`process exited with ${code} | ${signal}`);
        });

    mameProc.stdout
        .addListener('close', () => {
            console.log('stdout close');
        })
        .addListener('open', () => {
            console.log('stdout open');
        })
        .addListener('error', e => {
            console.error('stdout error: ', e);
        })
        .addListener('data', data => {
            let success = parser.parse(data);
            if (!success) {
                console.error('parse failed: ', parser.getError());
            }
        })
        .addListener('end', () => {
            console.log('stdout is done');
        });
}
