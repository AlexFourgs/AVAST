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
		</div>
		<div id="logView">
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
