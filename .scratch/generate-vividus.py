import configparser, pathlib, subprocess, json, urllib.request
cfg = configparser.ConfigParser()
cfg.read('../server/.env', encoding='utf-8')
db = cfg['DATABASE']
def sql(query):
    args = ['docker','exec','-i','-e','MYSQL_PWD='+db['PASSWORD'].strip().strip('"\''),'mysql57','mysql','-h',db['HOSTNAME'].strip(),'--port',db['HOSTPORT'].strip(),'-u',db['USERNAME'].strip(),'-N','-B',db['DATABASE'].strip(),'-e',query]
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        print('Database query failed:', r.stderr[:300]); raise SystemExit(1)
    return r.stdout
values = dict(line.split('\t',1) for line in sql("SELECT name,value FROM system_config WHERE type='wechat' AND name IN ('appid','appsecret')").splitlines())
assert values['appid'] == 'wx31d69efd89723e5c', 'AppID mismatch'
def post(endpoint, data, token=None):
    url = 'https://api.weixin.qq.com/' + endpoint
    if token: url += '?access_token=' + token
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=30) as response: return response.read()
auth = json.loads(post('cgi-bin/stable_token', {'grant_type':'client_credential','appid':values['appid'],'secret':values['appsecret'],'force_refresh':False}))
if 'access_token' not in auth:
    print(json.dumps(auth)); raise SystemExit(1)
token = auth['access_token']
page = 'pages/index/vividus/vividus'
out = pathlib.Path('.scratch/vividus-release'); out.mkdir(exist_ok=True)
result = {'appid':values['appid'], 'page':page, 'env_version':'release'}
for key, endpoint, payload in [
    ('url_link','wxa/generate_urllink',{'path':page,'env_version':'release','is_expire':False}),
    ('short_link','wxa/genwxashortlink',{'page_url':page,'page_title':'Hastens Vividus','is_permanent':True})
]:
    result[key] = json.loads(post(endpoint,payload,token))
    print(key, json.dumps(result[key],ensure_ascii=True))
code = post('wxa/getwxacodeunlimit',{'scene':'vividus','page':page,'check_path':True,'env_version':'release','width':1280},token)
if code.startswith(b'{'): print('QR error',code.decode())
else:
    (out/'vividus-miniprogram-code.png').write_bytes(code)
    print('QR saved',len(code),'bytes')
(out/'links.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
