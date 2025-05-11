# start.ps1
# Temporarily allow all scripts in *this* session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Unrestricted -Force

# Now run your normal start command
npx expo start --clear
