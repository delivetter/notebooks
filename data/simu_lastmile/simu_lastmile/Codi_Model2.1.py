    
from vrpy import VehicleRoutingProblem
import networkx as nx
import math
import matplotlib.pyplot as plt
import random

import vehicles

# hola

#Gx -> punt de la malla (grid)
#Vx -> punt del graf vial
#Dx -> punt d'entrega (delivery)
#Cx -> punt carrega/descarrega


entreguesoperador={"CORREOS":166,"AMAZON":150,"DHL":77,"UPS":34,"GLS":36,"ZELERIS":35}


num_del_points=699


random.seed(123*2)

#CARACTERISTIQUES VEHICLE

temps_descarrega_hub = 5 #min

temps_depot_hub= 44 #min #anar i tornada

vehicle_cap=20 #20 #parcels

jornada_laboral = 240 #min

veh_speed=5*1000/60 #5 km/h 

#veh_speed_depot= 300 

op_speed=80 #m/min (on average)

salari = 30 #eur/h

del_time = 1 #min/parcel

park_time = 0 #min/stop in cid



#NUMBER OF PACKAGES THAT AN OPERATOR CAN HAVE SIMULTANEOUSLY
operator_cap=1 #parcels


#time limit to run VRP greedy
tl = 20

node_colors = ['#'+''.join([random.choice('0123456789ABCDEF') for j in range(6)]) for i in range(300)]


def assign_deliveries(operador):
    dic={}
    for i in range(1,num_del_points+1):
        dic[i]=0
    assigned=0
    while assigned < entreguesoperador[operador]:
            number=random.randint(1,num_del_points)
            dic[number] += 1
            assigned += 1
    return dic


def create_malla(filename):
    #we add nodes to the graph and determine connexions
    dist_nodes=10
    G = nx.DiGraph()
    i=1
    file_path = filename
    with open(file_path, 'r') as file:
        next(file)  # Skip header
        for line in file:
            parts = line.strip().split(';')
            point = parts[0]
            point = point.replace("Point (","")
            point = point.replace(")","")
            coords = point.strip().split(' ')
            G.add_node("G"+str(i), coords=(float(coords[0]),float(coords[1])), tram=parts[5])
            i+=1
    for node1 in G:
        for node2 in G:
            if node1 != node2 and (G.nodes[node1]["tram"] == G.nodes[node2]["tram"] or distance(G.nodes[node1],G.nodes[node2])<dist_nodes*1.00):
                G.add_edge(node1,node2,cost=distance(G.nodes[node1],G.nodes[node2]))
                G.add_edge(node2,node1,cost=distance(G.nodes[node1],G.nodes[node2]))
    return G


 
def distance(node1,node2):
    return math.dist([node1["coords"][0],node1["coords"][1]],[node2["coords"][0],node2["coords"][1]])

def get_position_dict(G):
    pos={}
    for node in G:
        pos[node]=G.nodes[node]["coords"]
    return pos


def create_graf_vial(filename):
    G = nx.DiGraph()
    i=1
    file_path = filename
    with open(file_path, 'r') as file:
        next(file)  # Skip header
        for line in file:
            parts = line.strip().split(',')
            coords=(parts[1],parts[2])
            name="V"+str(i)
            G.add_node(name, coords=(float(coords[0]),float(coords[1])))
            i+=1

    #define manually by inspection the directions in the graph
    list_of_edges=[(101, 97), (97, 84), (84, 98), (98, 50), (50, 49), (49, 55), (56, 55), (98, 56), (56, 83), (83, 82), (82, 97), (81, 82), (85, 81), (49, 48), (48, 34), (34, 30), (30, 51), (51, 57), (57, 100), (3, 2), (55, 30), (2, 1), (7, 3), (48, 7), (17, 18), (18, 4), (4, 3), (3, 7), (7, 6), (6, 4), (1, 17), (17, 8), (8, 9), (9, 21), (21, 121), (121, 153), (153, 151), (9, 20), (20, 149), (149, 125), (125, 124), (124, 122), (122, 21), (19, 4), (12, 19), (16, 12), (131, 16), (100, 85), (85, 100), (85, 101), (135, 153), (132, 135), (133, 132), (123, 133), (117, 123), (119, 117), (130, 119), (154, 130), (131, 154), (39, 38), (38, 155), (155, 131), (57, 59), (59, 92), (92, 140), (140, 66), (66, 71), (71, 74), (74, 52), (52, 57), (66, 73), (73, 47), (47, 40), (40, 39), (8, 10), (10, 11), (11, 12), (100,93),(93,86),(86,99),(99,158),(158,157),(157,147),(147,145),(145,152),(152,151)]
    for elem in list_of_edges:
        G.add_edge("V"+str(elem[0]),"V"+str(elem[1]),cost=distance(G.nodes["V"+str(elem[0])],G.nodes["V"+str(elem[1])]))

    G.add_edge("V151","V101",cost=1600) #edge afegida per poder fer el recorregut entre nodes 151 i 101 (arestes superiors de la zona d'estudi)


    for i in range(1,len(G.nodes())+1):
        if G.degree["V"+str(i)] == 0: G.remove_node("V"+str(i))

    return G

def define_loading_unloading_points(filename):
    G = nx.DiGraph()
    i=1
    file_path = filename
    with open(file_path, 'r') as file:
        next(file)  # Skip header
        for line in file:
            parts = line.strip().split(',')
            coords=(parts[1],parts[2]) #CANVI
            G.add_node("C"+str(i), coords=(float(coords[0]),float(coords[1])),demanda=[])
            i+=1

    for i in range(1,len(G.nodes())+1):
        if "V"+str(i) not in graf_vial:
            G.remove_node("C"+str(i))
    return G


def define_delivery_points(filename):
    G = nx.DiGraph()
    i=1
    file_path = filename
    with open(file_path, 'r') as file:
        next(file)  # Skip header
        for line in file:
            entregues=assign_deliveries("CORREOS")[i]
            divisio=1
            while entregues > 0:
                if entregues >= operator_cap: assignacio=operator_cap
                else: assignacio=entregues
                
                parts = line.strip().split(';')
                coords=(parts[3],parts[4])
                G.add_node("D"+str(i)+"."+str(divisio), coords=(float(coords[0]),float(coords[1])),quantity=assignacio)
                divisio+=1
                entregues -= assignacio

            i+=1
    return G


def find_two_closest_points(p,G):
    #Finds the two closest points in graph G from point p
    distance1=("1",999999)
    distance2=("2",999999)
    prov_dist=0
    for node in G:
        if p != node:
            prov_dist=distance(G.nodes[node],p)
            if prov_dist<distance1[1]:
                distance2 = distance1
                distance1 = (node,prov_dist)
                
            elif prov_dist < distance2[1]:
                distance2 = (node,prov_dist)
    return distance1,distance2




def integrate_points_in_graph(G,P):
    #Points in P are integrated into the graph G
    for point in P:
        which_points=find_two_closest_points(P.nodes[point],G)
        '''
        if point[0]=="D":
            G.add_edge(which_points[0][0],point,dist=distance(G.nodes[which_points[0][0]],P.nodes[point]))
            G.add_edge(point,which_points[0][0],dist=distance(G.nodes[which_points[0][0]],P.nodes[point]))
        else:
'''
        if G.has_edge(which_points[0][0],which_points[1][0]):
             G.add_node(point, coords=P.nodes[point]["coords"])
             G.add_edge(which_points[0][0],point,cost=distance(G.nodes[which_points[0][0]],P.nodes[point]))
             G.add_edge(point,which_points[1][0],cost=distance(G.nodes[which_points[1][0]],P.nodes[point]))
        else:
            G.add_node(point, coords=P.nodes[point]["coords"])
            G.add_edge(which_points[1][0],point,cost=distance(G.nodes[which_points[1][0]],P.nodes[point]))
            G.add_edge(point,which_points[0][0],cost=distance(G.nodes[which_points[0][0]],P.nodes[point]))
    return G
 

def assign_delivery_to_cid(G_del,G_cid,peatonal):
    dicti={}
    for cid in G_cid:
        dicti[cid]=[]
    #We assign each of the delivery points in D to a loading and unloading point, based on the one that is closest
    for delivery in G_del:
        which_cid=""
        distance_cid=9999999
        for cid in G_cid:
            d = nx.dijkstra_path_length(peatonal, delivery, cid, weight="cost")
            if d < distance_cid:
                which_cid = cid
                distance_cid = d
        peatonal.nodes[delivery]["reference_cid"]=which_cid
        dicti[which_cid].append(delivery)
    return dicti


def divide_cid_assignment(G_del, assignacio, vehicle_cap):
    assignacio_final={}
    quantitat_final={}
    for cid in assignacio:
        assignacio_final[cid]={}
        quantitat_final[cid]={}
        i=1
        total_dem=0
        store_vals=[]
        for delnode in assignacio[cid]:
            quanti_delnode=punts_delivery.nodes[delnode]["quantity"]
            if total_dem + quanti_delnode > vehicle_cap:
                assignacio_final[cid][i]=store_vals
                quantitat_final[cid][i]=total_dem
                i+=1
                store_vals=[]
                total_dem=0
            total_dem += punts_delivery.nodes[delnode]["quantity"]
            store_vals.append(delnode)
            
        assignacio_final[cid][i]=store_vals
        quantitat_final[cid][i]=total_dem
    return assignacio_final, quantitat_final

def VRP_cid(G,dicti,D):
    '''
    Fem el VRP des del Depot fins als punts de carrega i descarregs
    '''
    #assignem la demanda a cada punt C:
    GVRP = nx.DiGraph()
    for point in G:
        if point[0]=="C":
            for i in range(1,len(assignacio_final[point])+1):
                total_demand = quantitat_final[point][i]
                pseudopoint = point+"."+str(i)
                if pseudopoint in cid_time: GVRP.add_node(pseudopoint,coords=G.nodes[point]["coords"],demand=total_demand)

    for node1 in GVRP.nodes:
        for node2 in GVRP.nodes:
            if node1 != node2:
                orignode1=node1[:node1.find('.')]
                orignode2=node2[:node2.find('.')]
                GVRP.add_edge(node1, node2, cost=nx.shortest_path_length(G, orignode1, orignode2, weight="cost") )
                GVRP.edges[node1,node2]["time"] = GVRP.edges[node1,node2]["cost"]/veh_speed + cid_time[node2]
    
    GVRP.add_node("Source", coords=(431781.593999999984, 4581933.96100000013))
    GVRP.add_node("Sink", coords=(431781.593999999984, 4581933.96100000013))

    G.add_node("Source", coords=(431781.593999999984, 4581933.96100000013))
    G.add_node("Sink", coords=(431781.593999999984, 4581933.96100000013))

    cost_to_depot=7300
    
    G.add_edge("Source", "V83", cost=0 )
    
    G.add_edge("V83", "Sink", cost=0  )

    cid_time["Sink"] = 0
    cid_time["Source"] = 0
    
    
    for node in GVRP.nodes:
        
        if node!="Source":
            if node[0] != "S": orignode=node[:node.find('.')]
            GVRP.add_edge("Source", node, cost=nx.shortest_path_length(G, "V83",orignode, weight="cost"))
            GVRP.edges["Source",node]["time"] = GVRP.edges["Source",node]["cost"]/veh_speed + cid_time[node]
        if node!="Sink":
            if node[0] != "S": orignode=node[:node.find('.')]
            GVRP.add_edge(node, "Sink", cost=nx.shortest_path_length(G, orignode,"V83", weight="cost"))
            GVRP.edges[node,"Sink"]["time"] = GVRP.edges[node,"Sink"]["cost"]/veh_speed

    return GVRP


def set_time_veh(n1,n2,G,cid,division):
    dist_to_time = G.edges[n1,n2]["cost"]/veh_speed
    time_in_node = park_time
    time_to_deliver=all_routes[cid][division]/op_speed
    return dist_to_time + time_in_node

def set_time_op(n1,n2,G):
    dist_to_time = G.edges[n1,n2]["cost"]/op_speed
    time_in_node = del_time
    return dist_to_time + time_in_node


def VRP_delivery(cid,division,G,dicti,D):
    '''
    Fem el VRP des del punt de carrega i descarrega fins a cada delivery point

    G --> graf peatonal
    '''
    to_deliver=0
    GVRP = nx.DiGraph()
    for deliv in assignacio_final[cid][division]:
        GVRP.add_node(deliv, coords=D.nodes[deliv]["coords"], demand=D.nodes[deliv]["quantity"])
        
        
    for node1 in GVRP.nodes:
        for node2 in GVRP.nodes:
            if node1 != node2:
                GVRP.add_edge(node1, node2, cost=nx.shortest_path_length(G, node1, node2, weight="cost") )
            
    GVRP.add_node("Source", coords=G.nodes[cid]["coords"])
    GVRP.add_node("Sink", coords=G.nodes[cid]["coords"])


    for node in GVRP.nodes:
        if node!="Source" and node!="Sink":
            GVRP.add_edge("Source", node, cost=nx.shortest_path_length(G, cid, node, weight="cost"))
            GVRP.add_edge(node, "Sink", cost=nx.shortest_path_length(G, node, cid, weight="cost"))
    return GVRP

  
###############################
'''
Tindrem:
    - graf_peatonal
    - graf_vial
    - punts_cid
    - punts_delivery
    
Al graf_peatonal, tenim:
    - Malla de carrers peatonals
    - Punts carrega i descarrega
    - Punts d'entrega

Al graf_vial, tenim:
    - Malla de carrers vials (per on poden circular vehicles motoritzats)
    - Punts carrega i descarrega
'''
        


#Creem el graf peatonal (no direccionat), una malla de punts separats per 10 metres
graf_peatonal = create_malla("GrafVial_Nodes_10mC.csv")


#Creem el graf vial (direccionat), una malla de punts que defineix els carrers
graf_vial = create_graf_vial("GrafVial_NodesC.csv")


#Definim tots els punts de carrega i descarrega de la zona


punts_cid = define_loading_unloading_points("GrafVial_NodesC.csv")

#Definim tots els punts d'entrega de la zona, que tenen una demanda determinada.
punts_delivery = define_delivery_points("CensComercialC.csv")


#A les seguents linies integrem els punts de cid i de delivery als grafs estructurals (peatonal i vial):

#cid --> graf_vial
integrate_points_in_graph(graf_vial,punts_cid)


#punts_delivery --> graf_peatonal
integrate_points_in_graph(graf_peatonal,punts_delivery)

#cid -->> graf_peatonal
integrate_points_in_graph(graf_peatonal,punts_cid)

#A cada punt de delivery li assignem un punt de cid de referencia; es alla on la furgo parara i fara l'entrega al punt de delivery.
assignacio = assign_delivery_to_cid(punts_delivery,punts_cid,graf_peatonal)

assignacio_final, quantitat_final = divide_cid_assignment(punts_delivery, assignacio, vehicle_cap)


van_total_distance=0
op_total_distance=0

all_routes={}
all_dists={}

#VRP for CLUSTER DELIVERIES
for cid in assignacio_final:
    all_routes[cid]={}
    all_dists[cid]={}
    for division in range(1,len(assignacio_final[cid])+1):
        if len(assignacio_final[cid][division])==0: continue
        GVRPdel=VRP_delivery(cid,division,graf_peatonal,assignacio_final,punts_delivery)
        VRPdel=VehicleRoutingProblem(GVRPdel, load_capacity=operator_cap)
        VRPdel.solve(heuristic_only=True)
        all_routes[cid][division]=VRPdel.best_routes
        all_dists[cid][division]=VRPdel.best_value
        op_total_distance +=  VRPdel.best_value

cid_time={}


#TIME SPENT PER CID:
for cid in all_routes:
    for division in all_routes[cid]:
        trip_time=0
        for trip in all_routes[cid][division]:
            number_of_stops= len(all_routes[cid][division][trip])-2
            trip_time += number_of_stops*del_time
        cid_time[cid+"."+str(division)]= len(assignacio_final[cid][division])*del_time####    



#VRP for VEHICLES
GVRP= VRP_cid(graf_vial,assignacio,punts_delivery)
VRPcid = VehicleRoutingProblem(GVRP, load_capacity=vehicle_cap)
VRPcid.duration = jornada_laboral
VRPcid.solve(time_limit=tl)
routes = VRPcid.best_routes
van_total_distance=VRPcid.best_value

print("Distancia total a peu dels operaris: "+str(op_total_distance))
print("Distancia recorreguda per les Ones: " + str(van_total_distance))

print("Temps Depot - Born - Depot:")
for trip in routes:
    suma=0
    visitats=0
    for i in range (len(routes[trip])-1):
        suma += GVRP.edges[routes[trip][i], routes[trip][i+1]]["time"]
        
        cidorig = routes[trip][i][:routes[trip][i].find('.')]
        if cidorig[0]=="C":
            for divisions in assignacio_final[cidorig]:
                visitats += len(assignacio_final[cidorig][divisions])
        
    print('Ruta {}:'.format(trip))
    print('Nre. CiDs visitats: {}'.format(len(routes[trip])-2))
            
    print("Nre. de punts d'entrega visitats: {}".format(visitats))
    print("Temps de repartiment: {} hores".format(suma/60))
    print("______________________________________________________________")

def dibuixar(G,node1,node2,clr):
    cami=nx.shortest_path(G,node1,node2)
    s=nx.DiGraph()
    for elem in cami:
        s.add_node(elem, coords=G.nodes[elem]["coords"])
    for i in range(len(cami)-1):
        s.add_edge(cami[i], cami[i+1])
    nx.draw(s,get_position_dict(s),node_size=0, node_color=clr, edge_color=clr,with_labels=False)

clr=["red","black","blue"]

for ruta in routes:
    print(routes[ruta])
    for i in range(0,len(routes[ruta])-1):
        if routes[ruta][i][0]=="S": node1=routes[ruta][i]
        if routes[ruta][i][0]=="C": node1=routes[ruta][i][:routes[ruta][i].find('.')]
        if routes[ruta][i+1][0]=="C": node2=routes[ruta][i+1][:routes[ruta][i+1].find('.')]
        if routes[ruta][i+1][0]=="S": node2=routes[ruta][i+1]
        #print(node1,node2)
        dibuixar(graf_vial, node1,node2,node_colors[ruta])

    plt.show()

#DRAWINGS
#nx.draw(graf_peatonal,get_position_dict(graf_peatonal),node_size=0, arrows=None, node_color="grey") #malla peatonal
#nx.draw(graf_vial,get_position_dict(graf_vial),node_size=5, node_color="blue",with_labels=True) #malla vial
#nx.draw(punts_cid,get_position_dict(punts_cid),node_size=10, node_color="red",with_labels=True) #punts cid
#nx.draw(punts_delivery,get_position_dict(punts_delivery),node_size=10, node_color="green",with_labels=True) #punts delivery
#plt.show()

