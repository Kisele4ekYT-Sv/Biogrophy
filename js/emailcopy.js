document.getElementById('copy-button').addEventListener('click', function() {
    var email = 'arampalyan0222@kis.com';
    var textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert("Скопировано в буфер обмена: " + textarea.value);
});
