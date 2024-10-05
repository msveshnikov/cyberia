@echo off

REM Export users collection
ssh -l ubuntu allchat.online "docker exec isocraft_mongodb_1 mongoexport --db isocraft --type csv --collection users --fields _id,email,admin,firstName,lastName,subscriptionStatus,subscriptionId,ip,coins,info,country,scheduling,usageStats.claude.moneyConsumed,usageStats.gemini.moneyConsumed,createdAt,lastLogin,isAdmin,ownedTiles,achievements,friends,balance,premium,profilePicture,customizationLevel,lastActiveAt,preferences >users.csv"

REM Export tiles collection
ssh -l ubuntu allchat.online "docker exec isocraft_mongodb_1 mongoexport --db isocraft --type csv --collection tiles --fields _id,x,y,owner,content,generatedAt,lastModified,isCustomized,aiPrompt,style,propertyType,color,size,material >tiles.csv"

REM Copy exported files to local machine
scp ubuntu@allchat.online:/home/ubuntu/users.csv .
scp ubuntu@allchat.online:/home/ubuntu/tiles.csv .
