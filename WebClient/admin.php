<!DOCTYPE HTML>
<html>

<head>
	<title>Client AVAST™</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="client.css">
	<link rel="stylesheet" type="text/css" href="admin.css">
	<script type="text/javascript" src="avastRq.js"></script>
    <script type="text/javascript" src="client.js"></script>
    <?php
    $db = new PDO('mysql:host=localhost;dbname=avast;charset=latin1', 'group4', 'group4');
    ?>
</head>

<body onload="init('admin')">
	<div id="devicesNav" class="sidenav">
		<a href="client.html" id="admin">Client</a>
		<a href="javascript:void(0)" id="closebtn" onclick="closeNav()">&times;</a>
	</div>

	<span id="openMenu" onclick="openNav()">&#9776;</span>

	<div id="main">
		<h1>AVAST™</h1>
		<div id="networkView">
            <h3>Réseau</h3>
            <table id="networkTable">
                <tr>
                    <th rowspan="7">Server</th>
                    <td rowspan="7" class="connection" id="connection-server-cc">&lt;---&gt;</td>
                    <th rowspan="7">CC</th>
                    <td rowspan="3" class="connection" id="connection-cc-rasp1">&lt;---&gt;</td>
                    <th rowspan="3">Rasp 1</th>
                    <td class="connection" id="connection-rasp1-Ubtn">&lt;---&gt;</td>
                    <th>Bouton</th>
                </tr>
                <tr id="networkEmpty">
                </tr>
                <tr>
                    <td class="connection" id="connection-rasp1-Upho">&lt;---&gt;</td>
                    <th>PhotoR</th>
                </tr>
                <tr id="networkEmpty">
                </tr>
                <tr>
                    <td rowspan="3" class="connection" id="connection-cc-rasp2">&lt;---&gt;</td>
                    <th rowspan="3">Rasp 2</th>
                    <td class="connection" id="connection-rasp2-Ucam">&lt;---&gt;</td>
                    <th>Caméra</th>
                </tr>
                <tr id="networkEmpty">
                </tr>
                <tr>
                    <td class="connection" id="connection-rasp2-Uben">&lt;---&gt;</td>
                    <th>Bend</th>
                </tr>
            </table>
		</div>
		<div id="logView">
            <h3>Logs</h3>
            <table id="logTable">
                <tr>
                    <th>Timestamp</th><th>Id du capteur</th><th>Contenu</th><th>Stack</th>
                </tr>
                <?php
                    $stmt = $db->query('SELECT * FROM Log');
                    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        echo '<tr>';
                        echo '<td>'.$row['timestamp'].'</td><td>'.$row['deviceId'].'</td><td>'.$row['content'].'</td><td>'.$row['stack'].'</td>';
                        echo '</tr>';
                    }
                ?>
            </table>
		</div>
	</div>

</body>

</html>
