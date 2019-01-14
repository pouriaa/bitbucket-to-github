## if you're okay with rewriting history,
## replace <YOUR_PRIVATE_EMAIL>, <YOUR_NAME>,
## <YOUR_GITHUB_USERNAME> with your credentials
## otherwise you'll publicize your email
for d in */; do
    cd $d 
    git filter-branch --env-filter '
      OLD_EMAIL="<YOUR_PRIVATE_EMAIL>"
      CORRECT_NAME="<YOUR_NAME>"
      CORRECT_EMAIL="<YOUR_GITHUB_USERNAME>@users.noreply.github.com"
      if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
      then
          export GIT_COMMITTER_NAME="$CORRECT_NAME"
          export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
      fi
      if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
      then
          export GIT_AUTHOR_NAME="$CORRECT_NAME"
          export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
      fi
      ' --tag-name-filter cat -- --branches --tags 
    git update-ref -d refs/original/refs/heads/*
    git push --force --tags origin 'refs/heads/*'
    cd ..
done
