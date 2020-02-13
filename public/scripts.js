$( () => {
        const currentProject = 'TestDB';
        const url            = `/api/issues/${currentProject}`;
        
        $.ajax({
          type: 'GET',
          url : url,
          success: (data) => {
            var issues= [];
            data.forEach( (issue) => {
              console.log(issue);
              const openstatus = issue.open === true ? 'OPEN' : 'CLOSED';
              var single = [
                '<div class="issue '+openstatus+'">',
                '<p class="id">id: '+issue._id+'</p>',
                '<h3>'+issue.issue_title+' -  ('+openstatus+')</h3>',
                '<br>',
                '<p>'+issue.issue_text+'</p>',
                '<p>'+issue.status_text+'</p>',
                '<br>',
                `<p class="id"><b>Created by:</b> ${issue.created_by}`+'  <br><b>Assigned to:</b> ' +issue.assigned_to,
                `<p class="id"><b>Created on:</b> ${issue.created_on}`+'  <br><b>Last updated:</b> '+issue.updated_on,
                '<br><a href="#" class="closeIssue" id="'+issue._id+'">close</a> <a href="#" class="deleteIssue" id="'+issue._id+'">delete</a>',
                '</div>'
              ];
              issues.push(single.join(''));
            });
            $('#issueDisplay').html(issues.join(''));
          }
        });
        
        $('#newIssue').submit(function(event){
          event.preventDefault();
          $(this).attr('action', `/api/issues/${currentProject}`);
          $.ajax({
            type: 'POST',
            url : url,
            data: $(this).serialize(),
            success: (data) => { window.location.reload(true); }
          });
        });
        
        $('#issueDisplay').on('click','.closeIssue', function(event) {
          event.preventDefault();
          $.ajax({
            type: 'PUT',
            url : url,
            data: {_id: $(this).attr('id'), open: false},
            success: (data) => { alert(data); 
                                 window.location.reload(true);
                               }
          });
        });
  
        $('#issueDisplay').on('click','.deleteIssue', function(event) {
          event.preventDefault();
          $.ajax({
            type: 'DELETE',
            url : url,
            data: {_id: $(this).attr('id')},
            success: (data) => { alert(data); 
                                 window.location.reload(true); 
                               }
          });
          
        });
      });