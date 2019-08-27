function send(event) 
{//validation missing
    event.preventDefault();

    var selectedFile = document.getElementById('inputGroupFile02').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        readXml=e.target.result;
        //var parser = new DOMParser();
        //var doc = parser.parseFromString(readXml, "application/xml");
        sendFetch(readXml);
    }
    reader.readAsText(selectedFile);

    
}

function sendFetch(doc) 
{
    var data = { xml : doc};

    fetch('/calculate', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => res.xml ? showXML(res.xml, res.ref) : showError())
    .catch(err => showError());
}

function showXML(xml, ref)
{
    console.log(ref);
    var str = xml;
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace('?', '');
        str = str.replace('?', '');
    
    $('#message').html(`<div class="card-body">
    <h5 class="card-title text-center">Seu XML Está Pronto</h5>
    <h6 class="card-subtitle mb-4 text-muted text-center">Clique no botão abaixo para fazer o download</h6>

        <pre class="prettyprint lang-xml" id="xml">
        ${str}
        </pre>
        <a href="${ref}" download="map" class="btn btn-outline-primary">Download</a>
</div>
    `);
    PR.prettyPrint();
}

function showError()
{
    $('#message').html(`<div class="card-body">
    <h5 class="card-title text-center">Erro ao Calcular Latitudes</h5>
    <h6 class="card-subtitle mb-4 text-muted text-center">Verifique se o arquivo enviado era um Map do OpenStreetMap</h6>

        <pre class="prettyprint lang-xml" id="xml">
&lt;!-- Não foi possível exibir seu xml. --&gt;
        </pre>
</div>
    `);
    PR.prettyPrint();
}

$('#inputGroupFile02').on('change',function(){
    var fileName = document.getElementById("inputGroupFile02").files[0].name; 
    $(this).next('#label').html(fileName);
})

function download() {
    
}