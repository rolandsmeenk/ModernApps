

function PlaneProjection(renderduration)
{
    var canvas_elem = null;
    var c3d = null;
    var camera_mat = null;
    var draw_wireframe = false;
    var options = {
        draw_backfaces: true,
        whiteout_alpha: 1,
        wireframe: false,
        subdivide_factor: 10.0,
        nonadaptive_depth: 0
    };
    var MIN_Z = 0.05;
    var horizontal_fov_radians = Math.PI / 2;
    var temp_mat0 = null;
    var temp_mat1 = null;
    var temp_mat2 = null;
    var proj_mat = null;
    var object_mat = null;
    var camera_mat = null;
    var last_spin_time = 0;
    var zoom_in_pressed = false;
    var zoom_out_pressed = false;
    var target_distance = 2;
    var object_omega = { x: 0, y: 0, z: 0 };


    this.Init = function (cv)
    {
        Dbg.Print("PlaneProjection.Init");
        
        canvas_elem = cv;
        var ctx = canvas_elem.getContext("2d");
        c3d = new jsgl.Context(ctx);

        temp_mat0 = jsgl.makeIdentityAffine();
        temp_mat1 = jsgl.makeIdentityAffine();
        temp_mat2 = jsgl.makeIdentityAffine();
        proj_mat = jsgl.makeWindowProjection(canvas_elem.width, canvas_elem.height, horizontal_fov_radians);
        object_mat = jsgl.makeOrientationAffine({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
        camera_mat = jsgl.makeOrientationAffine({ x: 0, y: 0, z: 0.2 + target_distance }, { x: 0, y: 0, z: -1 }, { x: 0, y: 1, z: 0 });

    }

    this.UnInit = function ()
    {
        Dbg.Print("PlaneProjection.UnInit");
        this.Control = null;
    }

    this.Reset = function () {
        Dbg.Print("PlaneProjection.Reset");
    }

    var hasBegun = false;
    this.Begin = function ()
    {
        Dbg.Print("PlaneProjection.Begin");
        this.Start = this.Now();
        this.End = this.Start + this.RenderDuration * 1000;
        hasBegun = true;
    }

    this.Now = function ()
    {
        if (Date.now)
            return Date.now();
        else
            return (new Date().getTime());
    }

    this.NextFrame = function (interval_id)
    {
        //Dbg.Print("Animator.NextFrame hasBegun : " + hasBegun);
        if (!hasBegun) this.Begin();

        //Dbg.Print("Animator.NextFrame Start : " + this.Start);
        var e = this.easer,
            now = this.Now() - this.Start,
            end = this.End - this.Start;

        if (now > end)
        {
            // clamp to end time
            now = end;
            return;
        }

    }

    this.Spin = function ()
    {
        _spin();
    }

    function getTime()
    {
        return (new Date()).getTime();
    }

    // Return the point between two points, also bisect the texture coords.
    function bisect(p0, p1)
    {
        var p = { x: (p0.x + p1.x) / 2,
            y: (p0.y + p1.y) / 2,
            z: (p0.z + p1.z) / 2,
            u: (p0.u + p1.u) / 2,
            v: (p0.v + p1.v) / 2
        };
        return p;
    }

    function drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v2, tv2, depth_count)
    {
        var edgelen01 =
                Math.abs(tv0.x - tv1.x) +
                Math.abs(tv0.y - tv1.y);
        var edgelen12 =
                Math.abs(tv1.x - tv2.x) +
                Math.abs(tv1.y - tv2.y);
        var edgelen20 =
                Math.abs(tv2.x - tv0.x) +
                Math.abs(tv2.y - tv0.y);
        var zdepth01 = Math.abs(v0.z - v1.z);
        var zdepth12 = Math.abs(v1.z - v2.z);
        var zdepth20 = Math.abs(v2.z - v0.z);

        var subdiv = ((edgelen01 * zdepth01 > options.subdivide_factor) ? 1 : 0) +
               ((edgelen12 * zdepth12 > options.subdivide_factor) ? 2 : 0) +
               ((edgelen20 * zdepth20 > options.subdivide_factor) ? 4 : 0);

        if (depth_count)
        {
            depth_count--;
            if (depth_count == 0)
            {
                subdiv = 0;
            } else
            {
                subdiv = 7;
            }
        }

        if (subdiv == 0)
        {
            if (draw_wireframe)
            {
                var ctx = c3d.canvas_ctx_;
                ctx.beginPath();
                ctx.moveTo(tv0.x, tv0.y);
                ctx.lineTo(tv1.x, tv1.y);
                ctx.lineTo(tv2.x, tv2.y);
                ctx.lineTo(tv0.x, tv0.y);
                ctx.stroke();
            } else
            {
                jsgl.drawTriangleRaw(c3d.canvas_ctx_, 
                        tv0.x, tv0.y,
                        tv1.x, tv1.y,
                        tv2.x, tv2.y,
                        v0.u, v0.v,
                        v1.u, v1.v,
                        v2.u, v2.v);
            }
            return;
        }

        // Need to subdivide.  This code could be more optimal, but I'm
        // trying to keep it reasonably short.
        var v01 = bisect(v0, v1);
        var tv01 = jsgl.projectPoint(v01);
        var v12 = bisect(v1, v2);
        var tv12 = jsgl.projectPoint(v12);
        var v20 = bisect(v2, v0);
        var tv20 = jsgl.projectPoint(v20);

        switch (subdiv)
        {
            case 1:
                // split along v01-v2
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v2, tv2);
                drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v1, tv1, v2, tv2);
                break;
            case 2:
                // split along v0-v12
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v12, tv12);
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v12, tv12, v2, tv2);
                break;
            case 3:
                // split along v01-v12
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v12, tv12);
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v12, tv12, v2, tv2);
                drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v1, tv1, v12, tv12);
                break;
            case 4:
                // split along v1-v20
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v20, tv20);
                drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v2, tv2, v20, tv20);
                break;
            case 5:
                // split along v01-v20
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v20, tv20);
                drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v2, tv2, v01, tv01);
                drawPerspectiveTriUnclippedSub(c3d, v2, tv2, v20, tv20, v01, tv01);
                break;
            case 6:
                // split along v12-v20
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v20, tv20);
                drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v12, tv12, v20, tv20);
                drawPerspectiveTriUnclippedSub(c3d, v12, tv12, v2, tv2, v20, tv20);
                break;
            default:
            case 7:
                drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v20, tv20, depth_count);
                drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v12, tv12, v01, tv01, depth_count);
                drawPerspectiveTriUnclippedSub(c3d, v2, tv2, v20, tv20, v12, tv12, depth_count);
                drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v12, tv12, v20, tv20, depth_count);
                break;
        }
        return;
    }

    function drawPerspectiveTriUnclipped(c3d, v0, v1, v2, depth_count)
    {
        var tv0 = jsgl.projectPoint(v0);
        var tv1 = jsgl.projectPoint(v1);
        var tv2 = jsgl.projectPoint(v2);
        drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v2, tv2, depth_count);
    }

    // Given an edge that crosses the z==MIN_Z plane, return the
    // intersection of the edge with z==MIN_Z.
    function clip_line(v0, v1)
    {
        var f = (MIN_Z - v0.z) / (v1.z - v0.z);
        return { x: v0.x + (v1.x - v0.x) * f,
            y: v0.y + (v1.y - v0.y) * f,
            z: v0.z + (v1.z - v0.z) * f,
            u: v0.u + (v1.u - v0.u) * f,
            v: v0.v + (v1.v - v0.v) * f
        };
    }

    // Draw a perspective-corrected textured triangle, subdividing as
    // necessary for clipping and texture mapping.
    function drawPerspectiveTriConventionalClipping(c3d, v0, v1, v2)
    {
        var clip = ((v0.z < MIN_Z) ? 1 : 0) +
             ((v1.z < MIN_Z) ? 2 : 0) +
             ((v2.z < MIN_Z) ? 4 : 0);
        if (clip == 7)
        {
            // All verts are behind the near plane; don't draw.
            return;
        }

        if (clip != 0)
        {
            var v01, v12, v20;
            switch (clip)
            {
                case 1:
                    v01 = clip_line(v0, v1);
                    v20 = clip_line(v0, v2);
                    drawPerspectiveTriUnclipped(c3d, v01, v1, v2);
                    drawPerspectiveTriUnclipped(c3d, v01, v2, v20);
                    break;
                case 2:
                    v01 = clip_line(v1, v0);
                    v12 = clip_line(v1, v2);
                    drawPerspectiveTriUnclipped(c3d, v0, v01, v12);
                    drawPerspectiveTriUnclipped(c3d, v0, v12, v2);
                    break;
                case 3:
                    v12 = clip_line(v1, v2);
                    v20 = clip_line(v0, v2);
                    drawPerspectiveTriUnclipped(c3d, v2, v20, v12);
                    break;
                case 4:
                    v12 = clip_line(v2, v1);
                    v20 = clip_line(v2, v0);
                    drawPerspectiveTriUnclipped(c3d, v0, v1, v12);
                    drawPerspectiveTriUnclipped(c3d, v0, v12, v20);
                    break;
                case 5:
                    v01 = clip_line(v0, v1);
                    v12 = clip_line(v2, v1);
                    drawPerspectiveTriUnclipped(c3d, v1, v12, v01);
                    break;
                case 6:
                    v01 = clip_line(v0, v1);
                    v20 = clip_line(v0, v2);
                    drawPerspectiveTriUnclipped(c3d, v0, v01, v20);
                    break;
            }
            return;
        }

        // No verts need clipping.
        drawPerspectiveTriUnclipped(c3d, v0, v1, v2);
    }

    // Draw a perspective-corrected textured triangle, subdividing as
    // necessary for clipping and texture mapping.
    //
    // Unconventional clipping -- recursively subdivide, and drop whole tris on
    // the wrong side of z clip plane.
    function drawPerspectiveTri(c3d, v0, v1, v2, depth_count)
    {
        var clip = ((v0.z < MIN_Z) ? 1 : 0) +
             ((v1.z < MIN_Z) ? 2 : 0) +
             ((v2.z < MIN_Z) ? 4 : 0);
        if (clip == 0)
        {
            // No verts need clipping.
            drawPerspectiveTriUnclipped(c3d, v0, v1, v2, depth_count);
            return;
        }
        if (clip == 7)
        {
            // All verts are behind the near plane; don't draw.
            return;
        }

        var min_z2 = MIN_Z * 1.1;
        var clip2 = ((v0.z < min_z2) ? 1 : 0) +
              ((v1.z < min_z2) ? 2 : 0) +
              ((v2.z < min_z2) ? 4 : 0);
        if (clip2 == 7)
        {
            // All verts are behind the guard band, don't recurse.
            return;
        }

        var v01 = bisect(v0, v1);
        var v12 = bisect(v1, v2);
        var v20 = bisect(v2, v0);

        if (depth_count)
        {
            depth_count--;
        }

        if (1)
        {//xxxxxx
            drawPerspectiveTri(c3d, v0, v01, v20, depth_count);
            drawPerspectiveTri(c3d, v01, v1, v12, depth_count);
            drawPerspectiveTri(c3d, v12, v2, v20, depth_count);
            drawPerspectiveTri(c3d, v01, v12, v20, depth_count);
            return;
        }

        switch (clip)
        {
            case 1:
                drawPerspectiveTri(c3d, v01, v1, v2);
                drawPerspectiveTri(c3d, v01, v2, v20);
                drawPerspectiveTri(c3d, v0, v01, v20);
                break;
            case 2:
                drawPerspectiveTri(c3d, v0, v01, v12);
                drawPerspectiveTri(c3d, v0, v12, v2);
                drawPerspectiveTri(c3d, v1, v12, v01);
                break;
            case 3:
                drawPerspectiveTri(c3d, v2, v20, v12);
                drawPerspectiveTri(c3d, v0, v1, v12);
                drawPerspectiveTri(c3d, v0, v12, v20);
                break;
            case 4:
                drawPerspectiveTri(c3d, v0, v1, v12);
                drawPerspectiveTri(c3d, v0, v12, v20);
                drawPerspectiveTri(c3d, v12, v2, v20);
                break;
            case 5:
                drawPerspectiveTri(c3d, v1, v12, v01);
                drawPerspectiveTri(c3d, v0, v01, v12);
                drawPerspectiveTri(c3d, v0, v12, v2);
                break;
            case 6:
                drawPerspectiveTri(c3d, v0, v01, v20);
                drawPerspectiveTri(c3d, v01, v1, v2);
                drawPerspectiveTri(c3d, v01, v2, v20);
                break;
        }
    }


    function rotateObject(scaled_axis) 
    {
        var angle = Math.asin(Math.sqrt(jsgl.dotProduct(scaled_axis, scaled_axis)));
        if (angle > Math.PI / 8)
        {
            angle = Math.PI / 8;
        }

        var axis = jsgl.vectorNormalize(scaled_axis);
        var mat = jsgl.makeRotateAxisAngle(axis, angle);
        object_mat = jsgl.multiplyAffine(mat, object_mat);
        jsgl.orthonormalizeRotation(object_mat);
    }

    // Return the first exterior hit or closest point between the unit
    // sphere and the ray starting at p and going in the r direction.
    function rayVsUnitSphereClosestPoint(p, r)
    {
        var p_len2 = jsgl.dotProduct(p, p);
        if (p_len2 < 1)
        {
            // Ray is inside sphere, no exterior hit.
            return null;
        }

        var along_ray = -jsgl.dotProduct(p, r);
        if (along_ray < 0)
        {
            // Behind ray start-point.
            return null;
        }

        var perp = jsgl.vectorAdd(p, jsgl.vectorScale(r, along_ray));
        var perp_len2 = jsgl.dotProduct(perp, perp);
        if (perp_len2 >= 0.999999)
        {
            // Return the closest point.
            return jsgl.vectorNormalize(perp);
        }

        // Compute intersection.
        var e = Math.sqrt(1 - jsgl.dotProduct(perp, perp));
        var hit = jsgl.vectorAdd(p, jsgl.vectorScale(r, (along_ray - e)));
        return jsgl.vectorNormalize(hit);
    }

    function screenToSpherePt(x, y)
    {
        var p = { x: camera_mat.e12, y: camera_mat.e13, z: camera_mat.e14 + 1 };
        // camera dir
        var r = { x: camera_mat.e0, y: camera_mat.e1, z: camera_mat.e2 };
        var up = { x: camera_mat.e4, y: camera_mat.e5, z: camera_mat.e6 };
        var right = { x: camera_mat.e8, y: camera_mat.e9, z: camera_mat.e10 };
        var tan_half = Math.tan(horizontal_fov_radians / 2);
        r = jsgl.vectorAdd(r, jsgl.vectorScale(right, x * tan_half));
        r = jsgl.vectorAdd(r, jsgl.vectorScale(up, y * tan_half));
        r = jsgl.vectorNormalize(r);

        return rayVsUnitSphereClosestPoint(p, r);
    }

    function _spin()
    {
        var t_now = getTime();
        var dt = t_now - last_spin_time;
        last_spin_time = t_now;
        if (dt > 100)
        {
            dt = 100;
        }
        if (dt < 1)
        {
            dt = 1;
        }

        // Zoom.
        if (zoom_in_pressed)
        {
            target_distance -= 2.0 * dt / 1000;
        }
        if (zoom_out_pressed)
        {
            target_distance += 2.0 * dt / 1000;
        }
        if (target_distance < 0)
        {
            target_distance = 0;
        }

        camera_mat.e14 = 0.2 + target_distance;

//        if (mouse_is_down)
//        {
//            var new_grab_point = screenToSpherePt(mouse_x, mouse_y);
//            if (mouse_grab_point == null && new_grab_point != null)
//            {
//                mouse_grab_point = jsgl.applyInverseRotation(object_mat, new_grab_point);
//            }
//            if (mouse_grab_point && new_grab_point)
//            {
//                var orig_grab_point = jsgl.applyRotation(object_mat, mouse_grab_point);
//                // Rotate the object, to map old grab point onto new grab point.
//                var axis = jsgl.crossProduct(orig_grab_point, new_grab_point);
//                axis = jsgl.vectorScale(axis, 0.95);
//                rotateObject(axis);

//                object_omega = jsgl.vectorScale(axis, 1000 / dt);
//            }
//        } else
//        {
//            mouse_grab_point = null;

//            object_omega = jsgl.vectorScale(object_omega, 0.95);
//            if (jsgl.dotProduct(object_omega, object_omega) < 0.000000001 &&
//                    zoom_in_pressed == false &&
//                    zoom_out_pressed == false)
//            {
//                object_omega = { x: 0, y: 0, z: 0 };
//                stop_spinning();
//                draw();
//                return;
//            }

//            var axis = jsgl.vectorScale(object_omega, dt / 1000);
//            rotateObject(axis);
//        }


        draw();
    }

    function draw()
    {
        // Clear with white.
        var ctx = c3d.canvas_ctx_;

        ctx.globalAlpha = options.whiteout_alpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas_elem.width, canvas_elem.height);
        ctx.globalAlpha = 1;

        var view_mat = jsgl.makeViewFromOrientation(camera_mat);

        // Update transform.
        jsgl.multiplyAffineTo(proj_mat, view_mat, temp_mat0);
        jsgl.multiplyAffineTo(temp_mat0, object_mat, temp_mat1);
        c3d.setTransform(temp_mat1);

        // Draw.
        var im_width = 100;// images[0].width;
        var im_height = 100;// images[0].height;
        var verts = [
	          { x: -1, y: -1, z: 0, u: 0, v: 0 },
	          { x: 1, y: -1, z: 0, u: im_width, v: 0 },
	          { x: 1, y: 1, z: 0, u: im_width, v: im_height },
	          { x: -1, y: 1, z: 0, u: 0, v: im_height }
	        ];
        var tverts = [];
        for (var i = 0; i < verts.length; i++)
        {
            tverts.push(jsgl.transformPoint(c3d.transform_, verts[i]));
            tverts[i].u = verts[i].u;
            tverts[i].v = verts[i].v;
        }

        drawPerspectiveTri(c3d, tverts[0], tverts[1], tverts[2], options.nonadaptive_depth);
        drawPerspectiveTri(c3d, tverts[0], tverts[2], tverts[3], options.nonadaptive_depth);

        if (options.wireframe)
        {
            ctx.globalAlpha = 0.3;
            ctx.fillRect(0, 0, canvas_elem.width, canvas_elem.height);
            draw_wireframe = true;
            ctx.globalAlpha = 1;
            drawPerspectiveTri(c3d, tverts[0], tverts[1], tverts[2], options.nonadaptive_depth);
            drawPerspectiveTri(c3d, tverts[0], tverts[2], tverts[3], options.nonadaptive_depth);
            draw_wireframe = false;
        }
    }






    this.Start = null;
    this.End = null;
    this.RenderDuration = renderduration;
}


