#!/bin/bash

echo "Testing API Domain Connectivity..."
echo "================================="

echo ""
echo "1. Testing OLD domain (y0o4w84ckoockck8o0ss8s48.tealogik.com):"
echo "----------------------------------------------------------------"
curl -s -I https://y0o4w84ckoockck8o0ss8s48.tealogik.com/api/blog-posts | head -1
echo "Admin panel: https://y0o4w84ckoockck8o0ss8s48.tealogik.com/admin"

echo ""
echo "2. Testing NEW domain (api.coffeelogik.com):"
echo "---------------------------------------------"
curl -s -I https://api.coffeelogik.com/api/blog-posts | head -1
echo "Admin panel: https://api.coffeelogik.com/admin"

echo ""
echo "3. Testing Frontend domain (coffeelogik.com):"
echo "----------------------------------------------"
curl -s -I https://coffeelogik.com | head -1

echo ""
echo "4. DNS Resolution:"
echo "------------------"
echo "Old domain IP:"
nslookup y0o4w84ckoockck8o0ss8s48.tealogik.com | grep "Address:" | tail -1

echo "New API domain IP:"
nslookup api.coffeelogik.com | grep "Address:" | tail -1

echo "Frontend domain IP:"
nslookup coffeelogik.com | grep "Address:" | tail -1

echo ""
echo "================================="
echo "If you see '200 OK' responses, that domain is working."
echo "If you see errors, that domain needs configuration."